import {
  BabyIcon,
  BanknoteIcon,
  BlocksIcon,
  Building2Icon,
  CalendarClockIcon,
  FingerprintIcon,
  GraduationCapIcon,
  HandshakeIcon,
  Layers3Icon,
  LayoutListIcon,
  LineChart,
  ListIcon,
  NewspaperIcon,
  PackageOpenIcon,
  SchoolIcon,
  SearchIcon,
  ShieldCheckIcon,
  Tally5Icon,
  UsersRoundIcon,
  FileBarChartIcon,
  RefreshCcw,
  ArchiveIcon,
  EllipsisVertical,
} from 'lucide-react';

export type IconProps = React.SVGAttributes<SVGElement> & {
  children?: never;
  color?: string;
};

export const Icons = {
  EllipsisVertical: EllipsisVertical,
  ArchiveIcon: ArchiveIcon,
  School: SchoolIcon,
  Tally: Tally5Icon,
  List: ListIcon,
  HandShake: HandshakeIcon,
  RefreshCcw: RefreshCcw,
  Blocks: BlocksIcon,
  Layers: Layers3Icon,
  Fingerprint: FingerprintIcon,
  Shield: ShieldCheckIcon,
  PackageOpen: PackageOpenIcon,
  Search: SearchIcon,
  LineChart: LineChart,
  Newspaper: NewspaperIcon,
  GraduationCap: GraduationCapIcon,
  Tasks: LayoutListIcon,
  Banknote: BanknoteIcon,
  Building: Building2Icon,
  Baby: BabyIcon,
  Users: UsersRoundIcon,
  CalendarClock: CalendarClockIcon,
  FileBarChart: FileBarChartIcon,
  Spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};
