import styles from "./SearchBar.module.css"
import toast from "react-hot-toast";

interface SearchBarProps {
    onSubmit: (query: string) => void
}

const SearchBar = ({onSubmit}: SearchBarProps) => {  
    const handleSubmit = (formdata: FormData) => {
        const query = formdata.get("query") as string;
        if(!query.trim()){
            toast("Please enter your search query.");
            return
        }
        onSubmit(query);
    }

    return (
      <header className={styles.header}>
        <div className={styles.container}>
        <a
            className={styles.link}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Powered by TMDB
        </a>

        <form className={styles.form} action={handleSubmit}>
            <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />

          <button className={styles.button} type="submit">
              Search
          </button>
        </form>
        </div>
      </header>
    )
}

export default SearchBar