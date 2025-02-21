// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
// https://stackoverflow.com/questions/49949099/react-createcontext-point-of-defaultvalue#:~:text=liked%20%40eric%2Dburel%27s%20comment%20of%20using%20throw%20to%20narrow%20the%20type%20of%20the%20context.
// https://kentcdodds.com/blog/how-to-use-react-context-effectively
// A wrapper for contexts that must, and will always, have a value.
// Avoid bulky code with repeated checks, reduce boilerplate, and make
// inappropriate usage fail fast & loudly
import { useContext, type Context } from "react";

export function useSafeContext<T>(Context: Context<T | undefined>) {
  const context = useContext(Context);
  if (context === undefined) throw new Error("Context Provider not found");
  return context as T;
}