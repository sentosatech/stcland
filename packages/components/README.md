# STC Component Library

The `@stcland/components` package is structured in a modular way, allowing for both normal components and Higher-Order Components (HOCs) with styled support. Below is an overview of the file system structure and an explanation of each important part:


### Component Export Patterns

- **Regular Components**: 
  Exported from `index.ts` for general use across applications without additional HOC wrappers.

- **HOC Components**:
  Exported from `withStyles/index.ts` to allow users to access styled versions of the core components. These components enhance the base functionality with added styling.


###### *Note:* make sure to create nested `withStyles` exports under each new component scope, for easier search.
---

### Example Usage 

Here’s how you might import and use these components:

```tsx
// Importing a regular X component
import { XComponent } from '@stcland/components'

// Importing a styled version of the X component
import { XComponent  } from '@stcland/components/withStyles'


// ALL components exported from the withStyles module should be wrapped in a StcStylesProvider.

<StcStylesProvider customStyles={newCustomStyles}>
  <XComponent />  {/* No need to pass customStyles to the HOCs */}
</StcStylesProvider>