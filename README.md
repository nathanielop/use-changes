# useChanges

A modern alternative to useState for deeply nested objects with support for redo and undo

## Usage

Usage of useChanges is very simple, with near drop in replacement for existing useState change objects.

#### Tracking Disabled (default behavior)
```js
import useChanges from 'react-use-changes';

export default ({ initial }) => {
  const { changed, addChanges } = useChanges({ initial });
  return (
    <input 
      value={changed.foo} 
      onChange={({ target: { value } }) => 
        addChanges({ foo: value })
      } 
    />
  )
}
```

#### Tracking Enabled (cooler behavior)
```js
import useChanges from 'react-use-changes';

const useTrackKeyPresses = ({ keys, action }) => {
  // Some hook or function for tracking global key presses
  // (you'll see why this is important momentarily)
}

export default ({ initial }) => {
  const { changed, addChanges, redo, undo } = useChanges({ initial });

  // Bind global shift+ctrl+z keypress to redo last action
  useTrackKeyPresses({
    action: redo,
    keys: ['shift', 'ctrl', 'z']
  })

  // Bind global ctrl+z keypress to undo last action
  useTrackKeyPresses({
    action: undo,
    keys: ['ctrl', 'z']
  })

  return (
    <input 
      value={changed.foo} 
      onChange={({ target: { value } }) => 
        addChanges({ foo: value })
      } 
    />
  )
}
```

## API

#### Inputs

- initial => nullable initial value
- trackChanges => optional boolean to indicate whether or not to track changes (defaults to false)

#### Outputs

- undo => function to undo last change from pointer (if trackChanges is enabled, and a previous change exists from pointer position)
- redo => function to redo last change from pointer (if trackChanges is enabled, and a next change exists from pointer position)
- changed => merged object which combines initial value with value from changes object
- setChanges => function to set overall changes and reset changeLog and pointer (for something such as clearing changes)
- addChanges => function to add changes to changes object, accepts key value pairs of changes to be applied onto changes object
- changes => raw object result of either addChanges or setChanges