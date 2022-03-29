import React, { useEffect, useState, useRef } from "react";
import Services from "../../services";
import styles from "./style.module.scss";
import { InView } from "react-intersection-observer";
import loader from "../../images/loader.gif";
import searchImg from "../../images/search.png";

function Search() {
  const ref = useRef(null);
  const recentSearchItems =
    JSON.parse(localStorage.getItem("recentItems")) || [];
  const [gifs, setGifs] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [isLoaderInView, setLoaderInView] = useState(false);
  const [pegination, setPegination] = useState({});
  const [loadCount, setLoadCount] = useState(0);
  const [isSerachFocusd, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (isLoaderInView) {
      Services.search({
        q: searchString,
        limit: 15,
        offset: loadCount,
      }).then((res) => {
        const gifsLoaded = [...gifs, ...res.data];
        setGifs(gifsLoaded);
        setLoadCount(gifsLoaded.length);
        setPegination(res.pagination);
      });
    }
  }, [isLoaderInView]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isSerachFocusd && ref.current && !ref.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () =>
      document.removeEventListener("mousedown", checkIfClickedOutside);
  }, [isSerachFocusd]);

  const addToRecentSearch = (searchString) => {
    const filteredRecentSearchItems = recentSearchItems.filter(
      (item) => item !== searchString
    );
    filteredRecentSearchItems.unshift(searchString);
    localStorage.setItem(
      "recentItems",
      JSON.stringify(filteredRecentSearchItems.splice(0, 10))
    );
  };

  const handleSearch = (recentStr) => {
    if (recentStr) setSearchString(recentStr);
    setIsSearchFocused(false);
    const q = recentStr || searchString;
    if (q) {
      addToRecentSearch(q);
      Services.search({
        q,
        limit: 15,
        offset: 0,
      }).then((res) => {
        setGifs(res.data);
        setLoadCount(res.data.length);
        setPegination(res.pagination);
      });
    }
  };

  return (
    <div className={styles.serachPage}>
      <div className={styles.serachContainer}>
        <input
          type="text"
          onChange={(e) => setSearchString(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          value={searchString}
          className={styles.inputField}
          placeholder="Search gifs"
          maxLength={50}
        />
        {isSerachFocusd && recentSearchItems.length > 0 && (
          <div className={styles.suggestionList} ref={ref}>
            <p>RECENT SEARCHES</p>
            <ul>
              {recentSearchItems.map((recentItem, idx) => (
                <li key={idx} onClick={() => handleSearch(recentItem)}>
                  {recentItem}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className={styles.searchButton}
          onClick={(e) => handleSearch()}
          title="Search"
        >
          <img src={searchImg} alt="search image" />
        </button>
      </div>
      <div className={styles.searchResults}>
        {gifs &&
          gifs.map(({ id, images, title }) => (
            <div key={id} className={styles.searchCard}>
              <img src={images?.original?.url} alt={title} />
              <p>{title}</p>
            </div>
          ))}
      </div>
      {pegination?.total_count > loadCount && (
        <InView onChange={(inView) => setLoaderInView(inView)}>
          <div className={styles.loaderContainer}>
            <img src={loader} alt="loader" className={styles.loaderImg} />
          </div>
        </InView>
      )}
      <div className={styles.footer}>
        <p>&copy; Kumar Abhishek</p>
      </div>
    </div>
  );
}

export default Search;
