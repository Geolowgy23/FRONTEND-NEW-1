import React, { useEffect, useReducer } from 'react';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import { useParams } from 'react-router-dom';
import { getAllByTag, getAllTags, search, getAll } from '../../Services/cupServices'; // Ensure getAll is imported
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';

// Initial state
const initialState = { cups: [], tags: [] };

// Reducer function to update the state
const reducer = (state, action) => {
  switch (action.type) {
    case 'CUPS_LOADED':
      return { ...state, cups: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cups, tags } = state;
  const { searchTerm, tag } = useParams(); // Extract searchTerm and tag from URL params

  // Fetching data when component is mounted or parameters change
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        dispatch({ type: 'TAGS_LOADED', payload: tags });
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };

    const fetchCups = async () => {
      try {
        let cups;
        if (tag) {
          cups = await getAllByTag(tag);
        } else if (searchTerm) {
          cups = await search(searchTerm);
        } else {
          cups = await getAll(); // This line calls the getAll function
        }
        dispatch({ type: 'CUPS_LOADED', payload: cups });
      } catch (error) {
        console.error("Error loading cups:", error);
      }
    };

    fetchTags();
    fetchCups();
  }, [searchTerm, tag]); // Add tag to dependency array

  return (
    <>
      <Search />
      <Tags tags={tags} />
      <Thumbnails cups={cups} />
    </>
  );
}
