# gen‑ui

**A next‑gen framework for building dynamic, LLM‑driven user interfaces**

---

## Overview

**gen‑ui** is a generative user interface architecture that enables large language models (LLMs) to **dynamically produce and render UI components** in real time. Unlike template-driven or hard-coded UIs, gen‑ui empowers LLMs to craft reactive layouts, controls, and elements on-demand—ushering in a future where the user interface adapts to context, intent, and conversation flow.

---

## Innovation Highlights

* **Generative-first UI**
  Interfaces aren't pre-assembled—they're **streamed** into view as JSON or React element definitions based on user interactions and LLM output.

* **Multi-tool & multi-agent integration**
  LLM agents seamlessly call tools (e.g. weather fetchers, maps, form builders), interpret the response, and assemble the corresponding UI dynamically.

* **Context-aware adaptability**
  gen‑ui tracks conversation state and context, ensuring generated UI components are tailored to user needs—no boilerplate, only relevant elements.

* **Flexible rendering engines**
  Quickly plug in React, React Native, Vue, or plain web UI renderers—gen‑ui’s output format is platform-agnostic and renderer-agnostic.

---

## Core Concepts

1. **Streaming UI JSON**
   LLMs output structured JSON definitions that describe UI components such as buttons, input fields, widgets, etc.

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

3. **Renderer layering**
   Renderer modules interpret JSON and mount live UI elements. React, Vue, and even terminal UIs are supported out of the box.

4. **Tool integration**
   Agents can invoke tools—internal or external APIs—and pipe the results into UI generator modules within the LLM response.

5. **Composable component library**
   Pre-built UI elements (tables, charts, forms) accelerate development, while custom components can be added into the toolkit.

---

## Getting Started

```bash
git clone https://github.com/olegakbarov/gen-ui.git
cd gen-ui
yarn install
```

Populate `.env` with your LLM provider/API credentials:

```
OPENAI_API_KEY=sk‑...
OTHER_TOOL_API_KEYS=...
```

Run the dev server:

```bash
yarn dev
```

Visit `http://localhost:3000` to explore an interactive demo where the UI renders in real time as the LLM constructs elements.

---

## Why gen‑ui Matters

| Traditional UI              | gen‑ui Approach                              |
| --------------------------- | -------------------------------------------- |
| Predefined, static markup   | **Dynamic** UI generated on-the-fly          |
| Requires upfront design/dev | **LLM defines and adapts UI during runtime** |
| Separate tool handling      | **Unified UI + logic via agent output**      |
| Limited personalization     | **UI evolves per user session & context**    |

This paradigm shift aligns with the latest AI-driven HCI models, enabling apps to sense intent and generate tailored interfaces without writing UI code manually.

---

## Use Cases

* Conversational forms that build themselves as you chat
* Dashboards that adapt to analytics queries or report needs
* Multimodal apps combining maps, charts, tables, and rich text
* Internal tools that reshape UI based on LLM-driven workflows

---

## Contributing

Contributions are welcome! Please review our \[CONTRIBUTING.md], open issues, or propose new renderer integrations, tool agents, or component sets.

---

## License

MIT
