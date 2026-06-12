import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { materialApi } from "./materialApi";
import { learningPaths } from "./learningPaths";
import { getQuizScores } from "./quizData";

const MaterialContext = createContext();

const initialState = {
  materials: materialApi.getDefaultMaterials(),
  progress: {},
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SET_MATERIALS":
      return { ...state, loading: false, materials: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function calcStats(materials, progress) {
  const quizScores = getQuizScores();
  const completedQuizzes = Object.keys(quizScores).length;
  const totalQuizzes = Object.keys(learningPaths).length;

  const total = materials.length + totalQuizzes;
  const completed = materials.filter(
    (material) => Number(progress[material.id] || 0) >= 100,
  ).length + completedQuizzes;
  
  const totalProgress = materials.reduce((sum, material) => {
    const value = Math.min(
      100,
      Math.max(0, Number(progress[material.id] || 0)),
    );
    return sum + value;
  }, 0) + (completedQuizzes * 100);

  return {
    total,
    completed,
    overallPercent: total > 0 ? Math.round(totalProgress / total) : 0,
  };
}

function calcPathStats(materials, progress, pathKey) {
  const materialsInPath = materials.filter(
    (material) => String(material.path || "").trim() === pathKey,
  );
  
  const quizScores = getQuizScores();
  const hasQuiz = quizScores[pathKey] ? 1 : 0;

  const totalCount = materialsInPath.length + 1; // +1 for the quiz
  const doneCount = materialsInPath.filter(
    (material) => Number(progress[material.id] || 0) >= 100,
  ).length + hasQuiz;
  
  const pathPercent =
    totalCount > 0
      ? Math.round(
          (materialsInPath.reduce((sum, material) => {
            const value = Math.min(
              100,
              Math.max(0, Number(progress[material.id] || 0)),
            );
            return sum + value;
          }, 0) + (hasQuiz * 100)) / totalCount,
        )
      : 0;

  return { totalCount, doneCount, pathPercent };
}

export const MaterialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMaterials = async () => {
      dispatch({ type: "LOADING" });
      const res = await materialApi.getAll(controller.signal);

      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        dispatch({ type: "SET_MATERIALS", payload: res.data });
      } else if (res.status !== 499) {
        dispatch({
          type: "SET_MATERIALS",
          payload: materialApi.getLocalMaterials(),
        });
      }

      dispatch({ type: "SET_PROGRESS", payload: materialApi.getProgress() });
    };

    fetchMaterials();
    return () => controller.abort();
  }, []);

  const stats = useMemo(
    () => calcStats(state.materials, state.progress),
    [state.materials, state.progress],
  );

  const pathStats = useMemo(() => {
    const result = {};
    Object.keys(learningPaths).forEach((pathKey) => {
      result[pathKey] = calcPathStats(
        state.materials,
        state.progress,
        pathKey,
      );
    });
    return result;
  }, [state.materials, state.progress]);

  return (
    <MaterialContext.Provider value={{ state, dispatch, stats, pathStats }}>
      {children}
    </MaterialContext.Provider>
  );
};

export const useMaterials = () => useContext(MaterialContext);
