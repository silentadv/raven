# Raven Discord Bot

Raven is a rpg discord bot

## Functional Requirements (RFs)

- [x] Users should be able to register an account.
- [x] Users should be able to create an character for a specific discord guild.
- [x] Users should be able to retrieve their character list.
- [x] Users should be able to retrieve a guild character profile.
- [x] Users should be able to allocate attribute points to their character.
- [x] It should be able to create an guild.
- [ ] Users should be able to retrieve guild profile.

## Rules (RNs)

- [x] It should not be possible to register with same discord user id.
- [x] It should not be possible to register more than one character per discord guild.
- [x] It should not be possible to register more than five characters per account.
- [x] It should not be able to allocate negative amount or zero character points.
- [x] It should not be possible to create an guild with same discord guild id.

## Non-Functional Requirements (RNFs)

- [x] The application data must be persisted in a PostgreSQL database.

## To-dos

- [x] Create all custom errors.
- [x] Create character use attribute points use-case.
