---
layout: single
title: "shop & scan status"
permalink: /projects/shop-scan-status/
toc: true
toc_label: "Contents"
toc_icon: "list"
---

# shop & scan status

**Technologies:** Swift, Service API Integration

A diagnostic utility app created during Meijer's hackathon program to streamline troubleshooting for the shop & scan application.

## The Problem

When shop & scan issues occurred, the reporting chain was inefficient: store support would call corporate, corporate would contact the product owner, and the product owner would reach out to the developer. This lengthy communication chain wasted time and resources when issues needed quick resolution.

## The Solution

The shop & scan status app eliminates unnecessary intermediaries by allowing direct diagnosis of service health. The application attempts to connect to each backend service and displays a simple smiley face for success or frowny face for failure.

Since the mobile app itself is "static" once released, failures typically originate from backend services or network issues rather than the app code. This tool visualizes service status in real-time, enabling quick identification of the actual problem source.

## Impact

Despite being a relatively small application, shop & scan status significantly reduced communication overhead and improved diagnostic efficiency across the deployment process. Store teams could quickly determine if an issue was service-related or something else entirely.

## Context: Agile at Meijer

This project emerged from Meijer's commitment to agile development, which included mandatory hackathons at the end of each program increment. These two-week periods allowed all staff—not just developers—to work on business-related projects of their choice, fostering innovation and practical problem-solving.

---

[Back to Projects]({{ "/projects/" | relative_url }}) | [View Resume]({{ "/resume/" | relative_url }})
