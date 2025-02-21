# Raven Discord Bot

Raven is a rpg discord bot

## Functional Requirements (RFs)

- [x] Users should be able to register an account.
- [x] Users should be able to view your profile.
- [x] Users should be able to allocate attribute points.
- [x] Users should be able to acquire items.
- [ ] Users should be able to view their inventory.
- [x] Users should be able to inspect your items.
- [x] Users should be able to view balance.

## Rules (RNs)

- [x] It should not be possible to register with same discord user id.
- [x] It should not be able to allocate negative amount or zero attribute points.
- [ ] It should not be possible to acquire zero or negative number of items.
- [ ] It should not be possible to acquire an non-listed item.
- [ ] Items should have different types (e.g., weapon, armor, consumable, material).

## Non-Functional Requirements (RNFs)

- [x] The application data must be persisted in a PostgreSQL database.

## To-dos

- [x] Create all custom errors.
- [x] Create use attribute points use-case.
