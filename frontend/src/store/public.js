import useStore from "./store";

const useSearch = () => {
  const { wordSearch } = useStore();

  const setWordSearch = (newSearch) => {
    useStore.setState({ wordSearch: newSearch });
  };

  return { wordSearch, setWordSearch };
};

export default useSearch;
