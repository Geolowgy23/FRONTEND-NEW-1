import { sample_cups, sample_tags } from "../data";

export const getAll = async () => sample_cups;  // Updated function name to getAll

export const search = async (searchTerm) => sample_cups
  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

export const getAllTags = async () => sample_tags;

export const getAllByTag = async tag => {
  if (tag === 'All') return getAll(); // Use getAll here
  return sample_cups.filter(item => item.tags?.includes(tag));
};

export const getById = async cupId =>
  sample_cups.find(item => item.id === cupId);
