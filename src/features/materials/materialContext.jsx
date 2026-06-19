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
  const total = materials.length;
  const completed = materials.filter(
    (material) => Number(progress[material.id] || 0) >= 100,
  ).length;
  
  const totalProgress = materials.reduce((sum, material) => {
    const value = Math.min(
      100,
      Math.max(0, Number(progress[material.id] || 0)),
    );
    return sum + value;
  }, 0);

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
  
  const totalCount = materialsInPath.length;
  const doneCount = materialsInPath.filter(
    (material) => Number(progress[material.id] || 0) >= 100,
  ).length;
  
  const pathPercent =
    totalCount > 0
      ? Math.round(
          materialsInPath.reduce((sum, material) => {
            const value = Math.min(
              100,
              Math.max(0, Number(progress[material.id] || 0)),
            );
            return sum + value;
          }, 0) / totalCount,
        )
      : 0;

  return { totalCount, doneCount, pathPercent };
}

export const MaterialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

const fetchMaterials = async () => {
  try {
    console.log("=== FETCH MATERIALS START ===");

    dispatch({ type: "LOADING" });

    const res = await materialApi.getAll(controller.signal);

    console.log("Material API Response:", res);

    if (res.ok && Array.isArray(res.data)) {
      console.log("Materials loaded:", res.data);

      dispatch({
        type: "SET_MATERIALS",
        payload: res.data,
      });
    } else {
      console.error("Material API Error:", res);

      dispatch({
        type: "ERROR",
        payload: res.error || "Failed to load materials",
      });
    }

    const progress = materialApi.getProgress();

    console.log("Progress:", progress);

    dispatch({
      type: "SET_PROGRESS",
      payload: progress,
    });

    console.log("=== FETCH MATERIALS SUCCESS ===");
  } catch (err) {
    console.error("=== FETCH MATERIALS FAILED ===");
    console.error(err);

    dispatch({
      type: "ERROR",
      payload: err.message,
    });
  }
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
