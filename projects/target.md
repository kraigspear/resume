---
layout: single
title: Target Mobile App
permalink: /projects/target/
toc: true
toc_label: "Contents"
header:
  image: /assets/images/target-mobile-deals.jpeg
  teaser: /assets/images/target-mobile-deals.jpeg
---

## Overview

The Target mobile app is a flagship retail experience that supports tens of millions of guests across the United States. It brings together shopping, fulfillment, and loyalty features—including Target Circle offers, Drive Up, Order Pickup, and same-day delivery powered by Shipt—into a cohesive native experience. With deep integration into store systems and e-commerce services, the app helps guests plan trips, manage orders, and unlock personalized savings wherever they shop.

## My Role

**Lead iOS Engineer, Account & Deals** — I guide the technical strategy and delivery for the Account and Deals surfaces inside the Target app. I partner closely with product, design, architecture, and platform teams to ensure these high-traffic areas stay fast, accessible, and reliable while evolving to meet guest expectations.

## Account Experience Modernization

- Led the modern SwiftUI rebuild of critical account screens, replacing legacy UIKit flows with a declarative, testable architecture based on **The Composable Architecture (TCA)**.
- Unified profile, payment, and personal settings into a single modular feature, improving navigation speed and reducing duplicated logic across the app.
- Established component libraries and design tokens shared with Android and web teams, keeping visual updates consistent across platforms.

## Deals & Personalization

- Directed the transformation of the Deals tab to a card-based layout that highlights limited-time offers, weekly ad content, and personalized Target Circle bonuses.
- Instrumented analytics and experimentation hooks that allow merchandising teams to iterate on placement and merchandising strategies safely.
- Collaborated with data science partners to surface the most relevant deals within milliseconds, even under heavy traffic during peak retail events.

![Target Deals screen]({{ "/assets/images/target-mobile-deals.jpeg" | relative_url }}){: .align-center}

## Product Demo

<video controls playsinline poster="{{ '/assets/images/target-mobile-deals.jpeg' | relative_url }}" class="border">
  <source src="{{ '/assets/images/target-video-demo.mp4' | relative_url }}" type="video/mp4">
  Your browser does not support the video tag. You can <a href="{{ '/assets/images/target-video-demo.mp4' | relative_url }}">download the video</a> instead.
</video>

## Security & Trust

- Championed the **Passkeys** rollout for Target guest accounts, delivering a fast and secure sign-in alternative that reduces reliance on passwords.
- Instituted secure enclave storage patterns and device-based cryptographic checks that meet internal compliance requirements without sacrificing usability.
- Worked with enterprise security teams to validate architecture decisions, threat models, and telemetry for passkey adoption.

## Architecture & Tooling

- Adopted a feature-driven structure with TCA, improving unit test coverage and enabling modular previews for rapid UI iteration.
- Built continuous integration checks that enforce SwiftFormat, linting, and snapshot testing across Account and Deals feature modules.
- Drove adoption of async/await networking wrappers and shareable concurrency utilities to simplify data pipelines.

## Impact

- Account and Deals sections serve **millions of daily active guests** and represent a substantial portion of app engagement.
- The modernized codebase reduced crash rates across Account journeys and accelerated feature delivery by enabling parallel development.
- Passkeys rollout increased successful sign-ins while reducing password reset calls to guest services.

## Collaboration Highlights

- Partnered with Target Circle merchandising and marketing teams to coordinate seasonal experiences (Back to School, Black Friday, Holiday) with localized messaging inside the app.
- Worked with Store Operations to ensure Drive Up and Order Pickup status surfaced correctly alongside account orders and deals.
- Mentored iOS engineers across squads, sharing TCA patterns, SwiftUI best practices, and architectural guidance for large-scale feature work.

## Technologies

- **Language:** Swift, SwiftUI
- **Architecture:** The Composable Architecture (TCA), modular feature packages
- **Frameworks:** Combine, Async/Await, Swift Concurrency, StoreKit, AuthenticationServices
- **Tooling:** Xcode Cloud, XCTest, Snapshot testing, SwiftFormat, Fastlane

## Related Links

- [Target on the App Store](https://apps.apple.com/us/app/target/id297430070)
- [Target Circle Loyalty Program](https://www.target.com/circle)

---

[Back to Projects]({{ "/projects/" | relative_url }}) | [View Resume]({{ "/resume/" | relative_url }})
