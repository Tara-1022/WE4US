https://join-lemmy.org/apps examples of lemmy apps; good code references

Food for thought: https://standardnotes.com/blog/react-native-is-not-the-future, https://www.reddit.com/r/reactjs/comments/ubdbkx/reactjs_vs_react_native_maintain_2_codebases_or_1/, https://bionicjulia.com/blog/moving-from-react-to-react-native. Aruvi's suggestion: keep simplicity of functionality - less likely to have cross platform deployment issues.

React Native UIs (in descending order of maturity):
- [Voyager](https://github.com/aeharding/voyager) - web + ios + android
- [Memmy](https://github.com/Memmy-App/memmy ) - ios + android
- [AOS](https://github.com/1hitsong/AOS) - mobile
  
API library for JS client: https://github.com/LemmyNet/lemmy-js-client (Note: since we're using release 0.19 of lemmy, make sure to specify `npm install lemmy-js-client@0.19`)

### Test Backend 
Either set up your own instance via [[Setting up lemmy via docker]]. Probably needed when testing log-in, post and community creation (logged-in actions)

or use the available [public instances](https://join-lemmy.org/docs/contributors/04-api.html#:~:text=following%20instances%20are%20available%20for%20testing%20purposes%3A) for fetching posts, communities etc.

### Hiding communities
As described in the Components design, the Job Board, PG Finder and Meet Up can be thought of as communities with custom UI, hidden from regular searches.

Looks like Lemmy does not have a built-in way to "hide" a specific community from feeds. It should be easy enough to modify the frontend code to filter out its posts by default.

### Auth
admins can configure OID https://github.com/LemmyNet/lemmy/pull/4881; https://github.com/LemmyNet/lemmy/issues/1368, https://github.com/LemmyNet/lemmy/issues/2930 via API call. However, it is available only in v4.