# Digital Marketing & Recommendation Services Quiz

This document contains 15 multiple choice questions about Digital Marketing frontend logic, server-side rendering, SEO meta tags, event collection, database architecture, and microservices.

---

## Single Answer Questions (3-4 choices, 1 correct answer)

### Question 1: Server-Side Rendering Purpose

Why is server-side rendering (SSR) particularly important for a digital marketing e-commerce application?

A) It reduces the server costs significantly  
B) It enables better SEO indexing since search engine crawlers can read the pre-rendered HTML content  
C) It eliminates the need for a database  
D) It prevents all security vulnerabilities  

**✅ Correct Answer: B**

*Explanation: SSR pre-renders pages on the server, allowing search engine crawlers to index the content effectively. This is crucial for e-commerce sites where product pages need to appear in search results.*

---

### Question 2: SEO Meta Tags Configuration

In a product page, what is the PRIMARY reason for including `ogTitle`, `ogDescription`, and `ogImage` meta tags?

A) To improve the website loading speed  
B) To optimize how the page appears when shared on social media platforms  
C) To store product pricing information  
D) To connect to the payment gateway  

**✅ Correct Answer: B**

*Explanation: Open Graph (og) meta tags control how content appears when shared on social media platforms like Facebook, LinkedIn, and others, improving click-through rates and engagement.*

---

### Question 3: Event Tracking Architecture

In the event tracking system, why is the event tracking call made asynchronously without blocking the main user interaction?

A) To save database storage space  
B) To ensure user experience is not degraded even if tracking fails  
C) To prevent duplicate events  
D) To reduce the number of API calls  

**✅ Correct Answer: B**

*Explanation: Asynchronous event tracking ensures that the user experience remains smooth. If the tracking service is slow or unavailable, the user can still complete their action (viewing products, adding to cart) without interruption.*

---

## Multiple Answer Questions (6-7 choices)

### Question 4: Event Types for ML Recommendations (2 correct answers)

Which of the following event types are commonly tracked to power machine learning recommendation systems in e-commerce applications?

A) `database_backup`  
B) `view` - when a user views a product page  
C) `server_restart`  
D) `add_to_cart` - when a user adds a product to cart  
E) `css_change`  
F) `config_update`  

**✅ Correct Answers: B, D**

*Explanation: `view` and `add_to_cart` events capture user intent and behavior, which are essential signals for ML recommendation algorithms. System events like backups, restarts, or config changes are not relevant for user behavior modeling.*

---

### Question 5: Microservices Benefits (5 correct answers)

When deciding whether to use a separate ML recommendation service instead of integrating it directly into the main application, which of the following are valid benefits of the microservice approach?

A) The ML service can be scaled independently based on its own resource requirements  
B) Teams can develop and deploy the ML service without affecting the main application  
C) The main application can function normally even if the ML service is temporarily unavailable  
D) It reduces the total number of servers needed  
E) Different programming languages and frameworks can be used for each service  
F) Updates to the ML model can be deployed without restarting the main application  
G) All data automatically syncs between services without any configuration  

**✅ Correct Answers: A, B, C, E, F**

*Explanation: Microservices allow independent scaling (A), separate development/deployment (B), graceful degradation (C), technology flexibility (E), and independent updates (F). However, microservices typically require MORE infrastructure, not less (D is false), and data synchronization requires explicit configuration (G is false).*

---

## True/False Question

### Question 6: Database Architecture for Event Tracking

**Statement:** When building an event tracking system for ML recommendations, you should store all event data in the same database as your product catalog and user data to ensure data consistency.

A) True  
B) False  

**✅ Correct Answer: B (False)**

*Explanation: Event data typically grows very rapidly (potentially millions of events per day) and has different access patterns than transactional data. It's often better to use a separate database optimized for time-series data or analytics workloads, while the main application database handles product and user data. This separation allows each database to be optimized for its specific use case and prevents event data from impacting the performance of the main application.*

---

## Additional Questions

### Question 7: Session Tracking Strategy

What is the recommended approach for tracking user sessions across page views for analytics purposes on the client side?

A) Rely solely on server-side IP tracking  
B) Generate a new session ID on every page load  
C) Use the user's email address as the session identifier  
D) Generate a persistent session ID stored in localStorage that persists across browser sessions  

**✅ Correct Answer: D**

*Explanation: A persistent session ID in localStorage allows tracking user behavior across multiple visits while respecting privacy (no PII). New IDs on every load (B) would lose session continuity, email (C) requires authentication and raises privacy concerns, and IP tracking (A) is unreliable due to shared networks and privacy regulations.*

---

### Question 8: Recommendation API Design

When designing a recommendations API endpoint, what should happen if the ML service is unavailable?

A) Return a 500 Internal Server Error to the client  
B) Block the entire page from loading  
C) Return an empty array and allow the page to function without recommendations  
D) Retry infinitely until the service responds  

**✅ Correct Answer: C**

*Explanation: Graceful degradation is essential. The recommendations feature is non-critical, so the application should continue to work normally by returning an empty array when the ML service is unavailable.*

---

### Question 9: SEO Keywords Implementation

What is the recommended way to include SEO keywords for a product page?

A) Add all keywords directly in the page URL  
B) Repeat keywords 100 times in hidden text  
C) Use the `meta name="keywords"` tag with relevant, product-specific keywords  
D) Add keywords only in image alt texts  

**✅ Correct Answer: C**

*Explanation: The meta keywords tag is the proper semantic way to indicate page keywords. While search engines like Google have reduced their reliance on this tag, it's still considered a best practice. Keyword stuffing (B) is penalized by search engines.*

---

### Question 10: Event Data Structure

What essential fields should be included in an event tracking database table for e-commerce analytics?

A) Only the timestamp of the event  
B) Only the product_id  
C) Only the user's full name and address  
D) event_type, product_id, user_session, and timestamp  

**✅ Correct Answer: D**

*Explanation: A comprehensive event tracking table needs: event_type (what happened), product_id (which product), user_session (who did it), and timestamp (when it happened). This combination enables analysis of user behavior patterns over time.*

---

### Question 11: Cart State Management

In a Nuxt.js application, what is the recommended approach for managing shopping cart state that needs to persist across page navigation?

A) Store cart data in URL query parameters  
B) Make an API call on every page load to fetch cart data  
C) Use Nuxt's `useState` composable for reactive state management  
D) Store cart in HTML cookies with the entire product details  

**✅ Correct Answer: C**

*Explanation: Nuxt's `useState` composable provides reactive state that persists across page navigation within the same session. It's hydrated from server to client during SSR and remains reactive. URL parameters (A) are limited in size, constant API calls (B) are inefficient, and cookies (D) have size limits and security concerns.*

---

### Question 12: Meta Description Length

What is the recommended maximum length for an SEO meta description to ensure it displays properly in search engine results?

A) Unlimited length  
B) 50 characters  
C) 500 characters  
D) 155-160 characters  

**✅ Correct Answer: D**

*Explanation: Search engines typically display around 155-160 characters of the meta description in search results. Descriptions longer than this get truncated with "..." which can impact click-through rates.*

---

### Question 13: Proxy Configuration for Microservices

Why would you configure a proxy route (like `/ml/**` → `http://127.0.0.1:3001/**`) in your main application for an ML service?

A) To slow down API responses for testing  
B) To completely replace the need for the ML service  
C) To avoid CORS issues and provide a unified API surface while hiding internal service architecture  
D) To permanently store ML data in the main application  

**✅ Correct Answer: C**

*Explanation: A proxy route allows the frontend to make requests to `/ml/` endpoints without knowing about the separate ML service. This avoids CORS issues (same origin), hides internal architecture from clients, and provides flexibility to change the ML service location without updating frontend code.*

---

### Question 14: Twitter Card Meta Tags

What is the purpose of including `twitterCard: 'summary_large_image'` in SEO meta configuration?

A) To block Twitter from accessing your site  
B) To create a Twitter account automatically  
C) To specify that shared links should display with a large image preview on Twitter  
D) To reduce the image file size  

**✅ Correct Answer: C**

*Explanation: The Twitter Card meta tag with value 'summary_large_image' instructs Twitter to display a large image preview when the link is shared, making posts more visually appealing and likely to get engagement.*

---

### Question 15: Database Indexing for Events

Which columns should be indexed in an event tracking table for optimal query performance?

Select all that apply:

A) product_id - for filtering events by product  
B) user_session - for retrieving user history  
C) event_type - for filtering by action type  
D) created_at - for time-based queries and analytics  
E) A random column that's never queried  

**✅ Correct Answers: A, B, C, D**

*Explanation: All columns that are commonly used in WHERE clauses or ORDER BY clauses should be indexed. product_id enables product analytics, user_session enables user journey analysis, event_type enables action filtering, and created_at enables time-series analysis. Indexing unused columns (E) wastes storage and slows down writes.*

---

## Summary

| Question | Type | Correct Answer(s) |
|----------|------|-------------------|
| 1 | Single Choice (4) | B |
| 2 | Single Choice (4) | B |
| 3 | Single Choice (4) | B |
| 4 | Multiple Choice (6) | B, D |
| 5 | Multiple Choice (7) | A, B, C, E, F |
| 6 | True/False | False (B) |
| 7 | Single Choice (4) | D |
| 8 | Single Choice (4) | C |
| 9 | Single Choice (4) | C |
| 10 | Single Choice (4) | D |
| 11 | Single Choice (4) | C |
| 12 | Single Choice (4) | D |
| 13 | Single Choice (4) | C |
| 14 | Single Choice (4) | C |
| 15 | Multiple Choice (5) | A, B, C, D |

---

*These questions are based on the Digital Marketing frontend application architecture, covering SSR with Nuxt.js, SEO optimization, event tracking for ML recommendations, microservices design, and database architecture best practices.*
