# diffGroupState

Manages grouping of diff services by a chosen field.

## Fields

| Field     | Description                          |
|-----------|--------------------------------------|
| `none`    | No grouping, all services in one list |
| `image`   | Group by Docker image name           |
| `network` | Group by network membership          |
| `status`  | Group by change status (added/changed/unchanged) |

## API

### `createDiffGroupState()`
Returns a default `DiffGroupState` with `field: 'none'` and empty groups.

### `setGroupField(state, field)`
Returns a new state with the specified group field set.

### `cycleGroupField(state)`
Cycles through `none → image → network → status → none`.

### `buildGroups(state, services, getField)`
Builds the internal group map from a list of service names.
`getField(service, field)` is a resolver callback that returns the value
for a given service and field.

### `getServicesInGroup(state, groupKey)`
Returns the list of service names belonging to a group key.

### `getAllGroupKeys(state)`
Returns the ordered list of group keys.

### `formatGroupHeader(field, key)`
Formats a display header string for a group, e.g. `[NETWORK: backend]`.
Returns an empty string when field is `none`.
