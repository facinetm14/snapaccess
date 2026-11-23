# Snapaccess

A NestJS API for generating devices and looking up their access codes. The [device controller](src/devices/devices.controller.ts) exposes `POST /devices/gen`, `GET /devices`, `POST /devices/codes`, and `DELETE /devices/:id`. See [sample requests](requests.http) for request bodies and the [device service](src/devices/devices.service.ts) for implementation details.

## Local development

Run `npm ci`, then `npm run start:dev`. Use `npm test` for the Jest suite or `npm run test:e2e` for the end-to-end suite.
