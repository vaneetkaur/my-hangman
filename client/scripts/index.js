var GameForm = React.createClass({
    getNewGame() {
        var phraseCurrentState = this.state.phraseCurrentState;
        $.ajax({
        url: '/start-new-game/',
        dataType: 'json',
        type: 'GET',
        phraseCurrentState: phraseCurrentState,
        success: function(result) {
            this.setState({phraseCurrentState: result.game.phraseCurrentState, attemptsLeft: result.game.attemptsLeft, status: result.game.status, playedCharacters: result.game.playedCharacters});
            $('#msgGameWon').hide();
            $('#msgGameLost').hide();
            $('#msgPhrase').hide();
            $('#msgPhraseCurrentState').hide();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
        });
        var options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        this.setState({phraseCurrentState: phraseCurrentState, options: options, disableButton: false});
    },

    getInitialState: function() {
        return {
            phraseCurrentState: '',
            attemptsLeft: 10,
            status: 'new',
            playedCharacters: []
        };
    },

    componentWillMount: function() {
        this.getNewGame();
    },

  handleCharacterSubmit: function(e) {
    e.preventDefault();
    e.target.disabled = true;
    var character = e.target.value;
    $.ajax({
        url: '/verify-character/'+character,
        dataType: 'json',
        type: 'POST',
        success: function(result) {
            this.setState({phrase: result.game.phrase, phraseCurrentState: result.game.phraseCurrentState, attemptsLeft: result.game.attemptsLeft, status: result.game.status, playedCharacters: result.game.playedCharacters});
            switch(result.game.status) {
                case 'new', 'in-progress':
                    $('#msgGameWon').hide();
                    $('#msgGameLost').hide();
                    $('#msgPhrase').hide();
                    $('#msgPhraseCurrentState').hide();
                    break;
                case 'won':
                    $('#msgGameWon').show();
                    $('#msgGameLost').hide();
                    $('#gameContent').hide();
                    $('#msgPhrase').show();
                    $('#msgPhraseCurrentState').show();
                    break;
                case 'lost':
                    $('#msgGameWon').hide();
                    $('#msgGameLost').show();
                    $('#gameContent').hide();
                    $('#msgPhrase').show(); 
                    $('#msgPhraseCurrentState').show();
                    break;    
            }
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
        });
  },
  render: function() {
    return (
        <div>
            <div id="gameContent">
                <div>
                    <h2> {this.state.phraseCurrentState} </h2>
                    <form>
                        {
                            this.state.options.map((opt) => {                                
                                if (this.state.playedCharacters.indexOf(opt) >= 0) {
                                    return <input type="submit" disabled="true" onClick={this.handleCharacterSubmit} value={opt} />
                                } else {
                                    return <input type="submit" onClick={this.handleCharacterSubmit} value={opt} />
                                }
                            })
                        }
                    </form>
                </div>
                <p> Attempts Left: {this.state.attemptsLeft} </p>
            </div>
            <div>
                <div id="msgPhrase">Selected word: {this.state.phrase}</div>
                <div id="msgPhraseCurrentState">You played: {this.state.phraseCurrentState}</div>
                <div id="msgGameWon">Congratulations, you've won! <a href="/">Play again</a>?</div>
                <div id="msgGameLost">Game Over! You've lost! <a href="/">Play again</a>?</div>
            </div>
        </div>            
    );
  }
});

ReactDOM.render(
  <GameForm />,
  document.getElementById('content')
);