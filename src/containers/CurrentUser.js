import { Component, h } from 'preact';
import RecentBookmarks from '../containers/RecentBookmarks';

export default class CurrentUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecking: true,
      authToken: null
    };

    this.handleStorageUpdated = this.handleStorageUpdated.bind(this);
  }

  componentWillMount() {
    this.updateAuthToken();
    browser.storage.onChanged.addListener(this.handleStorageUpdated);
  }

  componentWillUnmount() {
    browser.storage.onChanged.removeListener(this.handleStorageUpdated);
  }

  handleStorageUpdated(changes) {
    if (changes.hasOwnProperty('authToken')) {
      this.updateAuthToken();
    }
  }

  async updateAuthToken() {
    const storage = await browser.storage.sync.get('authToken');
    this.setState({
      isChecking: false,
      authToken: storage.authToken
    });
  }

  render() {
    if (this.state.isChecking) {
      return <div class="spinner" />;
    } else if (
      this.state.authToken != null &&
      this.state.authToken.length > 0
    ) {
      return <RecentBookmarks authToken={this.state.authToken} />;
    } else {
      return (
        <div className="no-content">
          <p>Set up your auth token on the extension options page</p>
          <button onClick={() => browser.runtime.openOptionsPage()}>
            Open Options
          </button>
        </div>
      );
    }
  }
}
