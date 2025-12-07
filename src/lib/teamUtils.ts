// Helper to format team IDs into readable names
export const formatTeamName = (teamId: string): string => {
  // Remove league suffix and format
  const parts = teamId.split('_');
  const league = parts.pop(); // Remove NFL, NBA, etc.
  return parts
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Format moneyline odds
export const formatMoneyline = (odds: number): string => {
  return odds > 0 ? `+${odds}` : `${odds}`;
};

// Format spread value
export const formatSpread = (value: number): string => {
  return value > 0 ? `+${value}` : `${value}`;
};

// Format total (O/U) value
export const formatTotal = (value: number): string => {
  return value.toString();
};

// Format bet type as badge text
export const formatBetTypeBadge = (betType: string): string => {
  switch (betType) {
    case 'moneyline': return 'ML';
    case 'spread': return 'SPR';
    case 'over_under': return 'O/U';
    default: return betType.toUpperCase();
  }
};

// Get display text for a bet selection
export const formatBetDisplay = (
  betType: string,
  selection: string,
  line: number,
  spreadValue?: number | null,
  totalValue?: number | null
): { primary: string; secondary: string } => {
  switch (betType) {
    case 'moneyline':
      return {
        primary: formatTeamName(selection),
        secondary: formatMoneyline(line),
      };
    case 'spread':
      return {
        primary: `${formatTeamName(selection)} ${formatSpread(spreadValue || 0)}`,
        secondary: formatMoneyline(line),
      };
    case 'over_under':
      return {
        primary: `${selection.toUpperCase()} ${totalValue}`,
        secondary: formatMoneyline(line),
      };
    default:
      return { primary: selection, secondary: formatMoneyline(line) };
  }
};

// Get team abbreviation
export const getTeamAbbreviation = (teamId: string): string => {
  const teamAbbreviations: Record<string, string> = {
    'DALLAS_COWBOYS_NFL': 'DAL',
    'DETROIT_LIONS_NFL': 'DET',
    'PITTSBURGH_STEELERS_NFL': 'PIT',
    'BALTIMORE_RAVENS_NFL': 'BAL',
    'WASHINGTON_COMMANDERS_NFL': 'WAS',
    'MINNESOTA_VIKINGS_NFL': 'MIN',
    'TENNESSEE_TITANS_NFL': 'TEN',
    'CLEVELAND_BROWNS_NFL': 'CLE',
    'NEW_ORLEANS_SAINTS_NFL': 'NO',
    'TAMPA_BAY_BUCCANEERS_NFL': 'TB',
    'LOS_ANGELES_RAMS_NFL': 'LAR',
    'BUFFALO_BILLS_NFL': 'BUF',
    'NEW_YORK_JETS_NFL': 'NYJ',
    'MIAMI_DOLPHINS_NFL': 'MIA',
    'NEW_ENGLAND_PATRIOTS_NFL': 'NE',
    'KANSAS_CITY_CHIEFS_NFL': 'KC',
    'LOS_ANGELES_CHARGERS_NFL': 'LAC',
    'DENVER_BRONCOS_NFL': 'DEN',
    'LAS_VEGAS_RAIDERS_NFL': 'LV',
    'HOUSTON_TEXANS_NFL': 'HOU',
    'INDIANAPOLIS_COLTS_NFL': 'IND',
    'JACKSONVILLE_JAGUARS_NFL': 'JAX',
    'CINCINNATI_BENGALS_NFL': 'CIN',
    'PHILADELPHIA_EAGLES_NFL': 'PHI',
    'NEW_YORK_GIANTS_NFL': 'NYG',
    'GREEN_BAY_PACKERS_NFL': 'GB',
    'CHICAGO_BEARS_NFL': 'CHI',
    'ATLANTA_FALCONS_NFL': 'ATL',
    'CAROLINA_PANTHERS_NFL': 'CAR',
    'ARIZONA_CARDINALS_NFL': 'ARI',
    'SAN_FRANCISCO_49ERS_NFL': 'SF',
    'SEATTLE_SEAHAWKS_NFL': 'SEA',
  };
  return teamAbbreviations[teamId] || teamId.substring(0, 3).toUpperCase();
};
