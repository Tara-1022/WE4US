https://join-lemmy.org/apps examples of lemmy apps; good code references

Food for thought: https://standardnotes.com/blog/react-native-is-not-the-future

React Native UIs:
- [AOS](https://github.com/1hitsong/AOS)
- [Memmy](https://github.com/Memmy-App/memmy )
  
API library for JS client: https://github.com/LemmyNet/lemmy-js-client

### Hiding communities
As described in the Components design, the Job Board, PG Finder and Meet Up can be thought of as communities with custom UI, hidden from regular searches.

Looks like Lemmy does not have a built-in way to "hide" a specific community from feeds. It should be easy enough to modify the frontend code to filter out its posts by default.