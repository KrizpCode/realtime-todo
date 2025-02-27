# Realtime Todo

## Hosted Application

- [https://app.taskmate.fun](https://app.taskmate.fun)

Frontend hosted on [Vercel](https://vercel.com/), backend hosted on [Railway](https://railway.com/).

## User Stories

- [x] ️I as a user can create to-do items, such as a grocery list.

- [x] I as another user can collaborate in real-time with user - so that we can
      (for example) edit our family shopping list together

- [x] I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending.

- [x] I as a user can filter the to-do list and view items that were marked as done - so that I can retrospect on my prior progress.

- [x] I as a user can create multiple to-do lists where each list has its unique URL that I can share with my friends - so that I could have separate to-do lists for my groceries and work related tasks.

- [x] I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts

## Next Steps if I had more time

- Utilize the socket events to update the cached data in the frontend, instead of just re-fetching the data

- Refactor some more components (Button for example) to be reusable and DRY. Utilizing [class-variance-authority](https://www.npmjs.com/package/class-variance-authority) to handle the styles of the components and variations.

- Add more fledged out test-cases, mainly tests for the frontend utilizing vitest, react testing library. And Cypress for e2e tests.

- Sub-tasks by adding a parentId to a TodoItem, then I could easily handle support for infinite nested levels of subtasks.

- Take more time to style the application and make it look more appealing and modern.

## What I would've done differently if this was a production application

- Utilize a realtime database like Convex/Firebase/Replicache to handle the persistence of the data with great realtime experiences.

- Regarding authentication, I would've taken more action against CSRF/XSS then what I have done

- Setup a proper CI/CD pipeline
