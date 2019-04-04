import React, {Component} from 'react'
import Navbar from "../Components/Navbar/Navbar"
import MovieList from "../Components/MovieList/MovieList"
import model from './../Model.js'
import MovieListFooter from "../Components/MovieListFooter/MovieListFooter";
const IMG_BASE_URL_SMALL = 'http://image.tmdb.org/t/p/w780/'
const REPLACEMENT_IMG_SMALL = 'https://i.imgur.com/v8ND5Ui.png'


//TODO: Fix states for all add/remove movie from list buttons so that they show changes directly instead of on reload

class MovieListPage extends Component {
    constructor() {
        super()

        this.state = {
            loading: true,
            offset: 0,
            movieList: [],
            noMoreEntries: false,
            inToWatchList: {},
            inWatchedList: {}
        }

    }

    componentDidMount() {
        this.loadContent(this.state.offset)
    }

    loadContent = (offset) => {
        let idType = null
        if(this.props.listType === 'To Watch List'){ // What list to get movies from
            idType = 'watchlist_id'
        } else {
            idType = 'watchedlist_id'
        }
        model.getMoviesFromList(idType, offset, 10)
            .then(data => {
                if(data.movies.length < 10){
                    this.setState({noMoreEntries: true})
                }
                if(data.movies.length !== 0){
                    this.setState(prevstate => ({
                        loading: false,
                        offset: offset + 10,
                        movieList: this.state.movieList.concat(data.movies.map(movie => ({
                            id: movie.id,
                            movieId: movie.movie_id,
                            image: (movie.image !== null ? IMG_BASE_URL_SMALL + movie.image : REPLACEMENT_IMG_SMALL ),
                            imgPath: movie.image,
                            title: (movie.name.length < 18) ? movie.name : movie.name.slice(0, 15) + '...',
                            watchedlist_id: movie.watchedlist_id,
                            watchlist_id: movie.watchlist_id
                        }))),
                        inToWatchList: data.movies.forEach((movie) => {
                            let inList = false
                            if(movie.watchlist_id !== null){inList = true}
                            return {...prevstate.inToWatchList, [movie.id]: inList}
                        }),
                        inWatchedList: data.movies.forEach((movie) => {
                            let inList = false
                            if(movie.watchedlist_id !== null){inList = true}
                            return {...prevstate.inWatchedList, [movie.id]: inList}
                        })
                    }))
                }
            })
            .catch(e => console.log(e))
    }

    handleToWatchListBtn = (movieId, title, image, action) => {
        if(action === 'add'){
            this.setState(prevState => ({inToWatchList: {...prevState.inToWatchList, [movieId]: true}}))
            model.addMovieToWatchList(movieId, title, image).then(data => console.log(data))
        } else if(action === 'remove') {
            this.setState(prevState => ({inToWatchList: {...prevState.inLists, [movieId]: false}}))
            model.deleteMovieFromToWatchList(movieId).then(data => console.log(data))
        }
    }

    handleWatchedListBtn = (movieId, title, image, action) => {
        if(action === 'add'){
            this.setState(prevState => ({inWatchedList: {...prevState.inWatchedList, [movieId]: true}}))
            model.addMovieToWatchedList(movieId, title, image).then(data => console.log(data))
        } else if(action === 'remove') {
            this.setState(prevState => ({inWatchedList: {...prevState.inWatchedList, [movieId]: false}}))
            model.deleteMovieFromWatchedList(movieId).then(data => console.log(data))
        }
    }

    handleLoadMore = () => {
        this.loadContent(this.state.offset)
    }

    render() {
        return (
            <div className="container appContainer">
                <Navbar/>
                {!this.state.loading &&
                <div>
                    <MovieList movieList={this.state.movieList}
                               listType={this.props.listType}
                               handleToWatchListBtn={this.handleToWatchListBtn}
                               handleWatchedListBtn={this.handleWatchedListBtn}
                               inToWatchList={this.state.inToWatchList}
                               inWatchedList={this.state.inWatchedList}/>

                    <MovieListFooter handleLoadMore={this.handleLoadMore}
                                     noMoreEntries={this.state.noMoreEntries}/>
                </div>}
            </div>
        );
    }
}

export default MovieListPage;
