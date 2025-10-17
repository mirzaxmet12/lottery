import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../service/axios";
import {
  fetchGamesStart,
  fetchGamesSuccess,
  fetchGamesFailure,
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
  updateGameStart,
  updateGameSuccess,
  updateGameFailure,
  gameStart,
  gameSuccess,
  gameFailure,
} from "./gameSlice";

// 🔹 1.  fetch game
function* handleFetchGames(action: ReturnType<typeof fetchGamesStart>): Generator {
  try {
    const { data }: any = yield call(axios.get, `/game-api/games/${action.payload || ""}`);
    yield put(fetchGamesSuccess(data.results));

  } catch (err: any) {
    yield put(fetchGamesFailure(err));
  }
}
function* handleFetchGameStart(action: ReturnType<typeof gameStart>): Generator {
  try {
    const { data }: any = yield call(axios.get, `/game-api/games/${action.payload}`);
    yield put(gameSuccess(data));
  } catch (err: any) {
    yield put(gameFailure(err));
  }
}

// 🔹 2. create game
function* handleCreateGame(action: ReturnType<typeof createGameStart>): Generator {
  try {

     yield call(axios.post, "/game-api/games/", action.payload);

    yield put(createGameSuccess());
    yield put(fetchGamesStart("")); 
  } catch (err: any) {

    yield put(createGameFailure(err));
  }
}

// update game
function* handleUpdateGame(action: ReturnType<typeof updateGameStart>): Generator {
  try {
    const { id, data } = action.payload as { id: number; data: FormData };
    console.log(data, id);
    const res = yield call(axios.put, `/game-api/games/${id}/`, data);
    yield put(updateGameSuccess());
    console.log(res);

    yield put(fetchGamesStart("")); 
  } catch (err: any) {
    yield put(updateGameFailure(err));
  }
}
// 🔹 3. activate
function* handleActivateGame(action: ReturnType<typeof activateGameStart>): Generator {
  try {
    const res = yield call(axios.post, `/game-api/games/${action.payload}/activate/`);
    console.log(res);

    yield put(activateGameSuccess());
    yield put(fetchGamesStart(""));
  } catch (err: any) {
    yield put(activateGameFailure(err));
    console.log(err);

  }
}

// 🔹 4. block
function* handleLockGame(action: ReturnType<typeof lockGameStart>): Generator {
  try {
     yield call(axios.post, `/game-api/games/${action.payload}/lock/`);
    yield put(lockGameSuccess());
    yield put(fetchGamesStart(""));
  } catch (err: any) {
    yield put(lockGameFailure(err));
    console.log(err);
  }
}

// 🔹 5. delete
function* handleDeleteGame(action: ReturnType<typeof deleteGameStart>): Generator {
  try {
    yield call(axios.delete, `/game-api/games/${action.payload}/`);
    yield put(deleteGameSuccess());
    yield put(fetchGamesStart(""));
  } catch (err: any) {
    yield put(deleteGameFailure(err));
  }
}

// 🔹 6. winners
function* handleFetchWinners(action: ReturnType<typeof fetchWinnersStart>): Generator {
  try {
    const { data }: any = yield call(axios.get, `/game-api/games/${action.payload}/winners`);
    yield put(fetchWinnersSuccess(data.winners || []));
  } catch (err: any) {
    yield put(fetchWinnersFailure(err));
  }
}

// Game Start
function* handleStartGame(action: ReturnType<typeof startGameStart>): Generator {
  try {
    yield call(axios.post, `/game-api/games/${action.payload}/start/`);
    yield put(startGameSuccess());
    yield put(fetchGamesStart("")); 
  } catch (err: any) {
    yield put(startGameFailure(err));
  }
}

function* handleDrawWinner(action: ReturnType<typeof drawWinnerStart>): Generator {
  try {
    const res:any= yield call(axios.post, `/game-api/games/${action.payload}/draw/`);
    console.log(res);
    yield put(drawWinnerSuccess(res.data));
    yield put(fetchWinnersStart(action.payload)); 
  } catch (err: any) {
    console.log(err);

    yield put(drawWinnerFailure(err));
  }
}

function* handleNextPrize(action: ReturnType<typeof nextPrizeStart>): Generator {
  try {
    yield call(axios.post, `/game-api/games/${action.payload}/next/`);
    yield put(nextPrizeSuccess());
    yield put(fetchGamesStart(""));
  } catch (err: any) {
    yield put(nextPrizeFailure(err));
  }
}
// 🔹 Root saga
export function* gameSaga() {
  yield takeLatest(fetchGamesStart.type, handleFetchGames);
  yield takeLatest(gameStart.type, handleFetchGameStart);
  yield takeLatest(createGameStart.type, handleCreateGame);
  yield takeLatest(updateGameStart.type, handleUpdateGame);
  yield takeLatest(activateGameStart.type, handleActivateGame);
  yield takeLatest(lockGameStart.type, handleLockGame);
  yield takeLatest(deleteGameStart.type, handleDeleteGame);
  yield takeLatest(fetchWinnersStart.type, handleFetchWinners);
  yield takeLatest(startGameStart.type, handleStartGame);
  yield takeLatest(drawWinnerStart.type, handleDrawWinner);
  yield takeLatest(nextPrizeStart.type, handleNextPrize);

}
