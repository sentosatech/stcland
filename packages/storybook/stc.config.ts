
import type { StclandStyles } from '@stcland/components'

// We also want to support partial customization:
// table: {
//   headerCell: 'p-10',
// }
const styles : StclandStyles = {
  table: {
    root: 'bg-secondary-main',
    // table: 'table-fixed',
    header: 'text-s text-primary-main text-left',
    // headerRow: '',
    // headerCell: 'font-medium pl-6 pb-4',
    body: 'text-gray-100 px-6',
    // row: 'border-t last:border-b border-primary-dark',
    // cell: 'px-6 py-6',
    // selectedRow: 'bg-gray-500',
    // subRow: 'text-secondary-main border-none',
  }
}

export default styles