import fetch from 'node-fetch'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



const styles = theme => ({
  item : {
    backgroundColor : '#fff',
    cursor : 'pointer',
    borderBottom : '1px solid #f5f5f5',
    width : '400px',
    '&:hover' : {
      backgroundColor : '#e8e8e8'
    },
  },
  global : {
    display : 'flex',
    alignItems : 'center',
    flexDirection : 'column',
    paddingTop : '150px'
  },
  search : {
    display : 'flex'
  },
  link :{
    fontStyle : 'italic',
  },
  result : {
    display: 'flex',
    justifyContent: 'space-between',
    width: '450px',
    borderBottom : '1px solid',
    paddingBottom : '5px',
    marginBottom : '10px',
    marginTop : '20px',
    color : '#000',
    textDecoration : 'none',
    '&:hover' : {
      color : '#757575'
    },

  }
})

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      suggests : [],
      search : '',
      suggestId : '',
      results : [],
      displaySuggest : false
    }
  }
  async search() {
    if(this.state.search.length < 3) return
          this.setState({displaySuggest : true})
      const res = await fetch(`${process.env.BACK_LINK}/suggest.php?search=${this.state.search}`)
      const funders = await res.json()
      this.setState({suggests : funders})
  }
  async changeInput(event) {
    await this.setState({search : event.target.value})
    await this.setState({results : []})
    this.search()
  }
  async getResult(event) {
    this.setState({displaySuggest : false})
      const res = await fetch(`${process.env.BACK_LINK}/suggest.php?search=${this.state.search}`)
      const funders = await res.json()
      this.setState({results : funders})
  }
  async clickSuggest(value) {
    await this.setState({search : value})
    this.search()
  }
  render() {
    const { classes } = this.props;
    let suggests = this.state.suggests
    let results = this.state.results
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return (
    <div className={classes.global}>
      <div className={classes.search}>
        <TextField id="standard-basic" style={{minWidth : '250px'}} label="Standard" value={this.state.search} onChange={this.changeInput.bind(this)} />
        <Button style={{width : '150px'}} onClick={this.getResult.bind(this)} variant="contained" color="primary">
          Search
        </Button>
        </div>
        <div style={{marginTop : '10px', transition : '600ms', overflow : 'hidden',maxHeight: this.state.displaySuggest ? '250px' : '0px'}}>
        {suggests.map(suggest => (
           <ListItem className={classes.item}>
            <ListItemText primary={suggest._source.name} onClick={this.clickSuggest.bind(this,suggest._source.name)}/>
            <Divider />
            </ListItem>

      ))}
      </div>
     
       <List component="nav" aria-label="main mailbox folders">
      {results.map(suggest => (
        <a href={suggest._source.url} target='_blank' className={classes.result}>
          <span style={{fontStyle : 'italic'}}>
          {suggest._source.name}
          </span>
          <span>
            {formatter.format(suggest._source.amount)}

          </span>
        </a>
      ))}
      </List>
    </div>
    )
  }
}

export default withStyles(styles)(Search)