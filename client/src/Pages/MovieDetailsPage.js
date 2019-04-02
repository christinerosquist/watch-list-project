import React, {Component} from 'react'
import MovieDetails from "../Components/MovieDetails/MovieDetails"
import model from './../Model.js'
import Loader from "react-loader-spinner"
import Navbar from "../Components/Navbar/Navbar";
const IMG_BASE_URL_LARGE = 'http://image.tmdb.org/t/p/w780'

// statefull component
class MovieDetailsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            inWatchedList: null,
            inToWatchList: null,
        }
    }

    componentDidMount() {
        const movieId = this.props.params.id
        this.getMovie(movieId)
        model.checkMovieInLists(movieId).then(res => this.setState({inWatchList: res.inWatchList, inToWatchList: res.inToWatchList}))
    }

    handleSetWatched = () => {
        if(this.state.inWatchedList){
            //TODO: Ta bort film från watchedlist i databasen
        } else {
            //TODO: Lägg till film i watchedlist i databasen
        }

        this.setState({inWatchedList: !this.state.inWatchedList})
    }

    handleSetToWatch = () => {
        if(this.state.inToWatchList){
            //TODO: Ta bort film från towatchlist i databasen
        } else {
            //TODO: Lägg till film till towatchlist i databasen
        }

        this.setState({inToWatchList: !this.state.inToWatchList})
    }

    getMovie = (movieId) => {
        model.getMovie(movieId)
            .then(data => {
                this.setState({
                    loading: false,
                    movie: {
                        id: data.id,
                        title: data.title,
                        description: data.overview,
                        budget: data.budget,
                        revenue: data.revenue,
                        status: data.status,
                        runtime: data.runtime,
                        voteCount: data.vote_count,
                        voteAverage: data.vote_average,
                        poster: IMG_BASE_URL_LARGE + data.poster_path,
                        IMDBId: data.imdb_id,
                        release: data.release_date
                    }
                })
            })
            .catch(e => console.log(e))
    }

    render() {
        return (
            <div className="container appContainer">
                <Navbar/>
                {this.state.loading && <div className="loader"><Loader type="Oval" color="#FF9A00" height="100" width="100"/></div>}
                {!this.state.loading && <MovieDetails movie={this.state.movie} inWatchedList={this.state.inWatchedList} inToWatchList={this.state.inToWatchList} handleSetWatched={this.handleSetWatched} handleSetToWatch={this.handleSetToWatch} loading={this.state.loading}/>}
            </div>
        );
    }
}

export default MovieDetailsPage;