-- ============================================================================
-- DATABASE CONSTRAINTS
-- ============================================================================
-- Run as a custom migration after:
--   npx prisma migrate dev --create-only
--
-- Prisma does not natively express CHECK constraints or partial unique indexes
-- in the Prisma schema, so these rules are maintained in the SQL migration.
--
-- IMPORTANT:
-- - Keep this SQL inside the generated migration.sql that will be applied.
-- - Once a migration has been applied/shared, do not edit it; create a new
--   migration for future constraint changes.
-- ============================================================================


-- ============================================================================
-- 1. INVENTORY
-- ============================================================================

-- Inventory quantities cannot be negative.
ALTER TABLE "InventoryItem"
  ADD CONSTRAINT inventory_quantity_nonneg
    CHECK ("quantity" >= 0),
  ADD CONSTRAINT inventory_reserved_nonneg
    CHECK ("reserved" >= 0);

-- Reserved stock cannot exceed total on-hand stock.
ALTER TABLE "InventoryItem"
  ADD CONSTRAINT inventory_reserved_lte_quantity
    CHECK ("reserved" <= "quantity");

-- Product variant cost and weight cannot be negative.
ALTER TABLE "ProductVariant"
  ADD CONSTRAINT variant_cost_nonneg
    CHECK ("costPrice" IS NULL OR "costPrice" >= 0),
  ADD CONSTRAINT variant_weight_nonneg
    CHECK ("weight" IS NULL OR "weight" >= 0);

-- Inventory reservations must always contain a positive quantity.
ALTER TABLE "InventoryReservation"
  ADD CONSTRAINT reservation_quantity_pos
    CHECK ("quantity" > 0);


-- ============================================================================
-- 2. INVENTORY LEDGER
-- ============================================================================
-- InventoryMovement.quantity is a signed delta.
--
-- RESERVATION and RELEASE affect InventoryItem.reserved.
-- All other movement types affect InventoryItem.quantity.
--
-- Positive movements:
--   PURCHASE, RETURN, TRANSFER_IN, RESERVATION
--
-- Negative movements:
--   SALE, DAMAGE, LOSS, TRANSFER_OUT, RELEASE
--
-- ADJUSTMENT may be either positive or negative, but never zero.
-- ============================================================================

ALTER TABLE "InventoryMovement"
  ADD CONSTRAINT movement_sign_by_type
  CHECK (
    (
      "type" IN (
        'PURCHASE',
        'RETURN',
        'TRANSFER_IN',
        'RESERVATION'
      )
      AND "quantity" > 0
    )
    OR
    (
      "type" IN (
        'SALE',
        'DAMAGE',
        'LOSS',
        'TRANSFER_OUT',
        'RELEASE'
      )
      AND "quantity" < 0
    )
    OR
    (
      "type" = 'ADJUSTMENT'
      AND "quantity" <> 0
    )
  );


-- ============================================================================
-- 3. TAX
-- ============================================================================

-- Tax rate cannot be negative.
ALTER TABLE "TaxRate"
  ADD CONSTRAINT taxrate_rate_nonneg
    CHECK ("rate" >= 0);

-- Tax validity period must be chronological.
-- validTo may be NULL for an open-ended rate.
ALTER TABLE "TaxRate"
  ADD CONSTRAINT taxrate_date_range_valid
    CHECK ("validTo" IS NULL OR "validTo" > "validFrom");


-- ============================================================================
-- 4. PRODUCT & PRICE LIST
-- ============================================================================

-- Product variant selling prices cannot be negative.
-- compareAtPrice may be NULL.
ALTER TABLE "ProductVariant"
  ADD CONSTRAINT variant_price_nonneg
    CHECK ("price" >= 0),
  ADD CONSTRAINT variant_compare_nonneg
    CHECK (
      "compareAtPrice" IS NULL
      OR "compareAtPrice" >= 0
    );

-- Price list prices cannot be negative.
-- Minimum quantity must be at least 1.
ALTER TABLE "PriceListItem"
  ADD CONSTRAINT pricelist_price_nonneg
    CHECK ("price" >= 0),
  ADD CONSTRAINT pricelist_minqty_pos
    CHECK ("minQuantity" >= 1);


-- ============================================================================
-- 5. ORDER & FULFILLMENT QUANTITIES
-- ============================================================================

-- Order monetary totals cannot be negative.
ALTER TABLE "Order"
  ADD CONSTRAINT order_totals_nonneg
  CHECK (
    "subtotal" >= 0
    AND "total" >= 0
    AND "discountTotal" >= 0
    AND "shippingTotal" >= 0
    AND "taxTotal" >= 0
  );

-- Order item quantity must be positive.
ALTER TABLE "OrderItem"
  ADD CONSTRAINT orderitem_quantity_pos
    CHECK ("quantity" > 0);

-- Cart item quantity must be positive.
ALTER TABLE "CartItem"
  ADD CONSTRAINT cartitem_quantity_pos
    CHECK ("quantity" > 0);

-- Shipment item quantity must be positive.
ALTER TABLE "ShipmentItem"
  ADD CONSTRAINT shipmentitem_quantity_pos
    CHECK ("quantity" > 0);

-- Return item quantity must be positive.
ALTER TABLE "ReturnItem"
  ADD CONSTRAINT returnitem_quantity_pos
    CHECK ("quantity" > 0);

-- Refund amount must be positive.
ALTER TABLE "Refund"
  ADD CONSTRAINT refund_amount_pos
    CHECK ("amount" > 0);


-- ============================================================================
-- 6. REVIEWS
-- ============================================================================

-- Review rating is strictly limited to 1 through 5.
ALTER TABLE "Review"
  ADD CONSTRAINT review_rating_range
    CHECK ("rating" BETWEEN 1 AND 5);


-- ============================================================================
-- 7. PROMOTIONS
-- ============================================================================

-- Promotion usage counters and limits cannot contain invalid values.
ALTER TABLE "Promotion"
  ADD CONSTRAINT promotion_usage_limit_nonneg
    CHECK (
      "usageLimit" IS NULL
      OR "usageLimit" >= 0
    ),

  ADD CONSTRAINT promotion_usage_count_nonneg
    CHECK ("usageCount" >= 0),

  ADD CONSTRAINT promotion_per_customer_limit_pos
    CHECK (
      "perCustomerLimit" IS NULL
      OR "perCustomerLimit" >= 1
    ),

  -- Promotion must end after it starts.
  -- endsAt may be NULL for an open-ended promotion.
  ADD CONSTRAINT promotion_date_range_valid
    CHECK (
      "endsAt" IS NULL
      OR "endsAt" > "startsAt"
    );


-- ============================================================================
-- 8. SHIPPING RATES
-- ============================================================================

-- Maximum order amount cannot be below minimum order amount.
-- maxOrderAmount may be NULL for an open-ended upper range.
ALTER TABLE "ShippingRate"
  ADD CONSTRAINT shippingrate_amount_range_valid
  CHECK (
    "maxOrderAmount" IS NULL
    OR "maxOrderAmount" >= "minOrderAmount"
  );


-- ============================================================================
-- 9. CUSTOMER ADDRESSES
-- ============================================================================

-- A customer may have many addresses, but only one can be the default.
CREATE UNIQUE INDEX customer_one_default_address
  ON "CustomerAddress" ("customerId")
  WHERE "isDefault" = true;


-- ============================================================================
-- 10. SOFT-DELETE / UNIQUE KEY NOTE
-- ============================================================================
-- Current @unique constraints on fields such as SKU/slug remain global.
--
-- If the business later requires reusing a SKU/slug after soft deletion,
-- replace the corresponding plain @unique constraint with a partial unique
-- index that excludes soft-deleted records.
--
-- Example concept:
--   WHERE "deletedAt" IS NULL
--
-- Do not add this unless soft-deleted SKU/slug reuse is an explicit
-- business requirement.
-- ============================================================================