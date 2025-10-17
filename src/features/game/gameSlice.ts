import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Prize {
  id?: number;
  name: string;
  type: string;
  quantity: number;
  ordering?: number;
  image?: string | null;
}

interface Game {
  id: number;
  name: string;
  store?: { id: number; name: string };
  status: "draft" | "active" | "finished" | 'locked';
  image?: string | null;
  from_bonus?: number;
  to_bonus?: number;
  prizes?: Prize[];
}

interface Winner {
  id: number;
  prize: Prize;
  client: { id: number; full_name: string; phone_number: string };
  awarded_at: string;
}

interface drawWinner {
  winner: {
    store_client_id: number,
    full_name: string,
    phone_number: string,
    total_bonuses: number
  },
  current_prize: {
    id: number,
    name: string,
    type: string,
    image: string | null
  },
  is_last_prize: false
}
interface GameState {
  games: Game[];
  game: Game | undefined;
  winners: Winner[];
  drawWinner: drawWinner | null
  gameDetail: Game | null;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  game: undefined,
  winners: [],
  drawWinner: null,
  gameDetail: null,
  count: 0,
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    fetchGamesStart(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    fetchGamesSuccess(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
      state.loading = false;
    },
    fetchGamesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    gameStart(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    gameSuccess(state, action: PayloadAction<Game>) {
      state.game = action.payload;
      state.loading = false;
    },
    gameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    //edit game detail
    updateGameStart(state, _action: PayloadAction<{ id: number; data: FormData }>) {
      state.loading = true;
    },
    updateGameSuccess(state) {
      state.loading = false;
    },
    updateGameFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // create game
    createGameStart(state, _action: PayloadAction<FormData>) {
      state.loading = true;
    },
    createGameSuccess(state) {
      state.loading = false;
    },
    createGameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // activate
    activateGameStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    activateGameSuccess(state) {
      state.loading = false;
    },
    activateGameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // lock
    lockGameStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    lockGameSuccess(state) {
      state.loading = false;
    },
    lockGameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // delete
    deleteGameStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteGameSuccess(state) {
      state.loading = false;
    },
    deleteGameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // winners
    fetchWinnersStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    fetchWinnersSuccess(state, action: PayloadAction<Winner[]>) {
      state.winners = action.payload;
      state.loading = false;
    },
    fetchWinnersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    // 🏁 Start Game
    startGameStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    startGameSuccess(state) {
      state.loading = false;
    },
    startGameFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    // 🎯 Draw Winner
    drawWinnerStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    drawWinnerSuccess(state, action:PayloadAction<drawWinner>) {
      state.loading = false;
      state.drawWinner=action.payload
    },
    drawWinnerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // ➡️ Next Prize
    nextPrizeStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    nextPrizeSuccess(state) {
      state.loading = false;
    },
    nextPrizeFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

  },
});

export const {
  fetchGamesStart,
  fetchGamesSuccess,
  fetchGamesFailure,
  gameStart,
  gameSuccess,
  gameFailure,
  updateGameStart,
  updateGameSuccess,
  updateGameFailure,
  createGameStart,
  createGameSuccess,
  createGameFailure,
  activateGameStart,
  activateGameSuccess,
  activateGameFailure,
  lockGameStart,
  lockGameSuccess,
  lockGameFailure,
  deleteGameStart,
  deleteGameSuccess,
  deleteGameFailure,
  fetchWinnersStart,
  fetchWinnersSuccess,
  fetchWinnersFailure,
  startGameStart,
  startGameSuccess,
  startGameFailure,
  drawWinnerStart,
  drawWinnerSuccess,
  drawWinnerFailure,
  nextPrizeStart,
  nextPrizeSuccess,
  nextPrizeFailure,
} = gameSlice.actions;

export default gameSlice.reducer;
