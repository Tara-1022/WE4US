https://join-lemmy.org/apps examples of lemmy apps; good code references

Food for thought: https://standardnotes.com/blog/react-native-is-not-the-future, https://www.reddit.com/r/reactjs/comments/ubdbkx/reactjs_vs_react_native_maintain_2_codebases_or_1/

React Native UIs (in descending order of maturity):
- [Voyager](https://github.com/aeharding/voyager) - web + ios + android
- [Memmy](https://github.com/Memmy-App/memmy ) - ios + android
- [AOS](https://github.com/1hitsong/AOS) - mobile
  
API library for JS client: https://github.com/LemmyNet/lemmy-js-client

### Hiding communities
As described in the Components design, the Job Board, PG Finder and Meet Up can be thought of as communities with custom UI, hidden from regular searches.

Looks like Lemmy does not have a built-in way to "hide" a specific community from feeds. It should be easy enough to modify the frontend code to filter out its posts by default.