#!/bin/bash
echo "Cleaning build cache..."
rm -rf .next
echo "Installing packages..."
npm install --legacy-peer-deps
echo "Starting dev server..."
npm run dev
