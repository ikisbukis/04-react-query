import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {fetchMovies} from "../../services/movieService"
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./App.module.css"

type ModuleWithDefault<T> = { default: T };

interface PaginationProps{
  totalPages: number
  current: number
  onPageChange: (NextPage: number) => void
}

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

function Paginate({totalPages, current, onPageChange} : PaginationProps) {
      return (
        <ReactPaginate 
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        forcePage={current  - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />
      )
}

function App() {

  const[selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const[query, setQuery] = useState<string>("");
  const[page, setPage] = useState<number>(1)

  const onClose = () => {
    setSelectedMovie(null);
  }

  const onSelect = (movie:  Movie) => {
    setSelectedMovie(movie);
  }

  function handleChange (newPage: number) {
    setPage(newPage);

  }

  const {data, isLoading, isError, isSuccess} = useQuery({
    queryKey:['movie', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  })

  const movies = data?.results ?? [];

  useEffect(()=> {
    if(isSuccess && data.results.length ===0){
      toast("No movies found for your request.")
    }
  }, [data, isSuccess])

  useEffect(()=>{
    if(isError){
      toast.error("Something went wrong. Please try again.")
    }
  }, [isError])

  const onSubmit = async (query: string) => {
      const newQuery = query.trim()

      if(!newQuery){
        toast.error("Please enter your search query.");
        return
      }

      setQuery(newQuery)
      setPage(1)
  }
  
  return (
    <>
      <div><Toaster /></div>
      
      <SearchBar onSubmit={onSubmit}/>
      {data && <Paginate  current={page} totalPages={data.total_pages} onPageChange={handleChange}/>}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={onSelect} movies={movies}/>}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose}/>}
    </>
  )
}

export default App
