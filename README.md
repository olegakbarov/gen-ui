### Running locally

1. Create a .env.local with `OPENAI_API_KEY`
2. `pnpm dev`

### Key ideas

```ts
const StreamableSchemaFragment = ({ data, children }) => {
  const handler = {
    get(_, prop) {
      // isFullyLoaded can be based on schema
      isFullyLoaded(data[prop]) ? data[prop] : new Promise(() => {});
    },
  };
  const proxyPropsObject = new Proxy(data, handler);
  return children(proxyPropsObject);
};

const Page = async () => {
  const partialData = await someStreamApiCall();
  return (
    <StreamableSchemaFragment data={partialData}>
      {(item) => <Suspense fallback={<>Loading...</>}>{item.text}</Suspense>}
    </StreamableSchemaFragment>
  );
};
```
