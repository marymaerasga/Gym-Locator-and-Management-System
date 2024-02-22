// // owner.js
// import useStore from "./store";

// const useOwner = () => {
//   const { owner } = useStore();

//   const addOwner = (newItem) => {
//     useStore.setState((state) => ({ owner: [...state.owner, newItem] }));
//   };

//   const updateOwner = (index, updatedItem) => {
//     useStore.setState((state) => ({
//       owner: state.owner.map((item, i) => (i === index ? updatedItem : item)),
//     }));
//   };

//   const removeOwner = (index) => {
//     useStore.setState((state) => ({
//       owner: state.owner.filter((_, i) => i !== index),
//     }));
//   };

//   return { owner, addOwner, updateOwner, removeOwner };
// };

// export default useOwner;
