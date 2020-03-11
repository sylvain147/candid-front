import fetch from 'node-fetch'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      suggests : [],
      search : '',
      suggestId : '',
      results : []
    }
  }
  async search() {
    if(this.state.search.length < 3) return
      const res = await fetch(`http://localhost/candid/suggest.php?search=${this.state.search}`)
      const funders = await res.json()
      this.setState({suggests : funders})
  }
  async changeInput(event) {
    await this.setState({search : event.target.value})
    await this.setState({results : []})
    this.search()
  }
  async getResult(event) {
      const res = await fetch(`http://localhost/candid/suggest.php?search=${this.state.search}`)
      const funders = await res.json()
      this.setState({results : funders})
  }
  async clickSuggest(value) {
    await this.setState({search : value})
    this.search()
  }
  render() {
    let suggests = this.state.suggests
    let results = this.state.results
    return <div>
      <input type='text' id='input' value={this.state.search} onChange={this.changeInput.bind(this)} />
        {suggests.map(suggest => (
        <p value={suggest._source.name} onClick={this.clickSuggest.bind(this,suggest._source.name)}>{suggest._source.name}</p>
      ))}
      <button onClick={this.getResult.bind(this)}>Search</button>
      {results.map(suggest => (
        <p>
        <a href={suggest._source.url} target='_blank'>{suggest._source.name}</a>
        </p>
      ))}
    </div>
  }
}

export default Search