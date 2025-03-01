// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {Initializable, UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

error AddressInsufficientBalance(address account);
error InvalidInputParameters();
error InvalidValue(uint256);
error InvalidSignature();
error OutOfVotePeriod();
error FailedInnerCall();

contract PredictionMarket is
    Initializable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using ECDSA for bytes32;

    event VoteEvent(string voteId);
    event CreatePoolEvent(
        string poolId,
        address sender,
        address tokenAddress,
        uint256 tokenAmount
    );
    event WithdrawEvent(string claimId);

    // keccak256(abi.encode(uint256(keccak256("PredictionMarketStorage")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant PredictionMarketStorageLocation =
        0x495976b1de7e08a382aaeed4d579be4f58b6ca6b75742ede148021ba1112c500;

    /// @custom:storage-location erc7201:PredictionMarketStorage
    struct PredictionMarketStorage {
        address signerAddress;
        address serviceFeeReceiverAddress;
        mapping(string => bool) claimed;
    }

    /**
     * @custom:function-parameter
     * @param id vote Id/pool Id/claim Id
     */
    struct Parameter {
        string id;
        address tokenAddress;
        uint256 tokenAmount;
        uint256 expireTimestamp;
        bytes signature;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev initializes the contract
     */
    function initialize(address msgSender, address singner) public initializer {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        $.signerAddress = singner;
        $.serviceFeeReceiverAddress = msgSender;

        __Pausable_init();
        __Ownable_init(msgSender);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Pauses the function
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the function
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Owner set new service fee receiver address
     * @param _serviceFeeReceiverAddress New receiver address
     */
    function configServiceFee(
        address _serviceFeeReceiverAddress
    ) external onlyOwner {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        if (_serviceFeeReceiverAddress == address(0))
            revert InvalidInputParameters();

        $.serviceFeeReceiverAddress = _serviceFeeReceiverAddress;
    }

    /**
     * @dev Owner set new signer address
     * @param _signer New signer address
     */
    function configSignerAddress(address _signer) external onlyOwner {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        if (_signer == address(0)) revert InvalidInputParameters();
        $.signerAddress = _signer;
    }

    /**
     * @dev Vote for a pool
     * @param parameter Vote function parameters
     */
    function placeVote(
        Parameter calldata parameter
    ) external payable nonReentrant whenNotPaused {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        // invalid input parameters
        if (bytes(parameter.id).length == 0 || parameter.tokenAmount == 0)
            revert InvalidInputParameters();

        // vote time out of vote period
        if (parameter.expireTimestamp < block.timestamp)
            revert OutOfVotePeriod();

        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(
            keccak256(
                abi.encodePacked(
                    parameter.id,
                    _msgSender(),
                    parameter.tokenAddress,
                    parameter.tokenAmount,
                    parameter.expireTimestamp,
                    block.chainid
                )
            )
        );

        if (messageHash.recover(parameter.signature) != $.signerAddress)
            revert InvalidSignature();

        if (parameter.tokenAddress == address(0)) {
            // Native token transfer
            if (msg.value != parameter.tokenAmount)
                revert InvalidInputParameters();
        } else {
            // ERC20 token transfer
            IERC20 token = IERC20(parameter.tokenAddress);
            uint256 tokenBalance = token.balanceOf(address(this));

            token.transferFrom(
                _msgSender(),
                address(this),
                parameter.tokenAmount
            );

            if (
                token.balanceOf(address(this)) !=
                tokenBalance + parameter.tokenAmount
            ) revert InvalidValue(parameter.tokenAmount);
        }

        emit VoteEvent(parameter.id);
    }

    /**
     * @dev Create a pool
     * @param parameter createPool function parameters
     */
    function createPool(
        Parameter calldata parameter
    ) external payable nonReentrant whenNotPaused {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        // invalid input parameters
        if (bytes(parameter.id).length == 0 || parameter.tokenAmount == 0)
            revert InvalidInputParameters();

        if (parameter.tokenAddress == address(0)) {
            if (msg.value != parameter.tokenAmount)
                revert InvalidInputParameters();

            sendValue(
                payable($.serviceFeeReceiverAddress),
                parameter.tokenAmount
            );
        } else {
            // ERC20 token transfer
            IERC20 token = IERC20(parameter.tokenAddress);
            require(
                token.transferFrom(
                    _msgSender(),
                    $.serviceFeeReceiverAddress,
                    parameter.tokenAmount
                )
            );
        }

        emit CreatePoolEvent(
            parameter.id,
            _msgSender(),
            parameter.tokenAddress,
            parameter.tokenAmount
        );
    }

    /**
     * @dev Claim a pool
     * @param parameter withdraw function parameters
     */
    function withdraw(
        Parameter calldata parameter
    ) external nonReentrant whenNotPaused {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        if (
            $.claimed[parameter.id] ||
            parameter.tokenAmount == 0 ||
            parameter.expireTimestamp < block.timestamp
        ) revert InvalidInputParameters();

        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(
            keccak256(
                abi.encodePacked(
                    parameter.id,
                    _msgSender(),
                    parameter.tokenAddress,
                    parameter.tokenAmount,
                    parameter.expireTimestamp,
                    block.chainid
                )
            )
        );

        if (messageHash.recover(parameter.signature) != $.signerAddress)
            revert InvalidSignature();

        $.claimed[parameter.id] = true;

        if (parameter.tokenAddress == address(0)) {
            sendValue(payable(_msgSender()), parameter.tokenAmount);
        } else {
            IERC20 token = IERC20(parameter.tokenAddress);
            if (token.balanceOf(address(this)) < parameter.tokenAmount)
                revert AddressInsufficientBalance(address(this));
            require(token.transfer(_msgSender(), parameter.tokenAmount));
        }

        emit WithdrawEvent(parameter.id);
    }

    /**
     * @dev Claim service fee
     * @param parameter claimServiceFee function parameters
     */
    function claimServiceFee(
        Parameter calldata parameter
    ) external nonReentrant onlyOwner {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        if (parameter.tokenAmount == 0) revert InvalidInputParameters();

        if (parameter.tokenAddress == address(0)) {
            sendValue(
                payable($.serviceFeeReceiverAddress),
                parameter.tokenAmount
            );
        } else {
            IERC20 token = IERC20(parameter.tokenAddress);
            if (token.balanceOf(address(this)) < parameter.tokenAmount)
                revert AddressInsufficientBalance(address(this));
            require(
                token.transfer(
                    $.serviceFeeReceiverAddress,
                    parameter.tokenAmount
                )
            );
        }
    }

    /**
     * @dev Upgrade the contract
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    /**
     * @dev Get PredictionMarketStorage data
     */
    function _getPredictionMarketStorage()
        private
        pure
        returns (PredictionMarketStorage storage $)
    {
        assembly {
            $.slot := PredictionMarketStorageLocation
        }
    }

    /**
     * @dev Send value to recipient
     * @param recipient Recipient address
     * @param amount Value amount
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    function signerAddress() external view returns (address) {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        return $.signerAddress;
    }

    function serviceFeeReceiverAddress() external view returns (address) {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        return $.serviceFeeReceiverAddress;
    }

    function claimed(string calldata id) external view returns (bool) {
        PredictionMarketStorage storage $ = _getPredictionMarketStorage();

        return $.claimed[id];
    }

    function getInitializeFunctionData(
        address msgSender,
        address singner
    ) external view returns (address, bytes memory) {
        return (
            address(this),
            abi.encodeWithSelector(this.initialize.selector, msgSender, singner)
        );
    }
}
