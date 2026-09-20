import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
    results: Movie[]
    page: number
    total_pages: number
    total_results: number;
}

const bearerToken = import.meta.env.VITE_TMDB_TOKEN;

const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/movie",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearerToken}`
    },
};

export const fetchMovies = async (query: string, page: number) => {
    const response = await axios.request<MovieResponse>({...options, params: {query, page}})
    return response.data
}

