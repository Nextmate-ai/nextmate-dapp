import { CharacterRoleType } from '@/types/character.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
	characters: CharacterRoleType[];
	selectedCharacterId: string | null;
}

const initialState: CharacterState = {
	characters: [],
	selectedCharacterId: null,
};

const characterSlice = createSlice({
	name: 'characters',
	initialState,
	reducers: {
		setCharacters: (state, action: PayloadAction<CharacterRoleType[]>) => {
			state.characters = action.payload;
		},
		selectCharacter: (state, action: PayloadAction<string>) => {
			state.selectedCharacterId = action.payload;
		},
		updateCharacter: (state, action: PayloadAction<CharacterRoleType>) => {
			const index = state.characters.findIndex(
				char => char.id === action.payload.id,
			);
			if (index !== -1) {
				state.characters[index] = action.payload;
			}
		},
	},
});

export const { setCharacters, selectCharacter, updateCharacter } =
	characterSlice.actions;

export default characterSlice.reducer;

export const selectAllCharacters = (state: { characters: CharacterState }) =>
	state.characters.characters;
export const selectSelectedCharacter = (state: {
	characters: CharacterState;
}) => {
	const { characters, selectedCharacterId } = state.characters;
	return characters.find(char => char.id === selectedCharacterId) || null;
};
