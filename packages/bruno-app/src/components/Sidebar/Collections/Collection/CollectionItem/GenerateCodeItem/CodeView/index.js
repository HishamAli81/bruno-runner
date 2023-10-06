import CodeEditor from 'components/CodeEditor/index';
import { HTTPSnippet } from 'httpsnippet';
import { useTheme } from 'providers/Theme/index';
import { usePreferences } from 'providers/Preferences/index';
import { buildHarRequest } from 'utils/codegenerator/har';

const CodeView = ({ language, item }) => {
  const { storedTheme } = useTheme();
  const { preferences } = usePreferences();
  const { target, client, language: lang } = language;
  let snippet = '';

  try {
    snippet = new HTTPSnippet(buildHarRequest(item.request)).convert(target, client);
  } catch (e) {
    console.error(e);
    snippet = 'Error generating code snippet';
  }

  return <CodeEditor readOnly value={snippet} font={preferences.codeFont} theme={storedTheme} mode={lang} />;
};

export default CodeView;
