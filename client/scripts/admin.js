var GamesList = React.createClass({
    getGamesList() {
        $.ajax({
        url: '/get-list/',
        dataType: 'json',
        type: 'GET',
        success: function(result) {
            this.setState({ gamesList: result.gamesList });
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
        });
        this.setState({ gamesList: [] });
    },

    getInitialState: function() {
        return {
            gamesList: []
        };
    },

    componentWillMount: function() {
        this.getGamesList();
    },

  render: function() {
    return (
            <div>
                <h2> List of games </h2>
                <ol>
                    {
                        Object.keys(this.state.gamesList).map((key) => {
                            return <li> {this.state.gamesList[key].phrase} - {this.state.gamesList[key].status} - {this.state.gamesList[key].attemptsLeft} attempts left </li>
                        })
                    }                   
                </ol>
            </div>            
    );
  }
});

ReactDOM.render(
  <GamesList />,
  document.getElementById('content')
);