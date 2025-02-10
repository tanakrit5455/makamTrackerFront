import { CONFIG } from 'src/config-global';

import { BoardView } from 'src/sections/board';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BoardView />;
}
