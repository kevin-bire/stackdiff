# sortState

Manages sorting of service entries in the diff view.

## State Shape

```ts
interface SortState {
  field: 'name' | 'changeCount' | 'status';
  direction: 'asc' | 'desc';
}
```

## Functions

- **createSortState(field?, direction?)** — Create initial sort state. Defaults to `name asc`.
- **setSort(state, field)** — Set sort field. If the same field is selected again, toggles direction.
- **cycleSortField(state)** — Cycle through available sort fields in order: `name → changeCount → status → name`.
- **toggleSortDirection(state)** — Flip sort direction between `asc` and `desc`.
- **sortServices(services, state)** — Sort a list of `SortableService` objects according to current state.
- **formatSortLabel(state)** — Return a human-readable label like `Sort: name ↑`.

## Status Order

When sorting by `status`, the order is: `added → removed → modified → unchanged`.

## Usage

```ts
let sort = createSortState();
sort = setSort(sort, 'changeCount'); // { field: 'changeCount', direction: 'asc' }
sort = setSort(sort, 'changeCount'); // { field: 'changeCount', direction: 'desc' }
const sorted = sortServices(myServices, sort);
```
