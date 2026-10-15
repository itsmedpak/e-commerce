--
-- PostgreSQL database dump
--

\restrict gKkccRSazva0mkFTGV8VPCBMSIdgoPUeer6i4ZfAlDSLSeYR59senPJTmWE6v0I

-- Dumped from database version 14.24 (Ubuntu 14.24-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.24 (Ubuntu 14.24-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "passwordHash", status, "createdAt", "updatedAt", "resetTokenHash", "resetTokenExpiresAt", "avatarUrl", phone) FROM stdin;
cmur06fu30000ew2dzcl8hjj8	Admin	itsmeozadpak@gmail.com	$2b$12$LEF9auw0njGkz.CGsBHrc.beq7bm87kY6Uv/K3Gthrij5ahWiV8fm	ACTIVE	2026-10-02 13:32:47.403	2026-10-04 13:07:46.066	\N	\N	/api/auth/profile/avatar/cmur06fu30000ew2dzcl8hjj8-f27d5671-52e6-4eae-9bc4-64ebdf2d9fd8.jpg	\N
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", action, "entityType", "entityId", metadata, "ipAddress", "userAgent", "createdAt") FROM stdin;
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Brand" (id, name, slug, description, "logoUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BrandTranslation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BrandTranslation" (id, "brandId", locale, name, description) FROM stdin;
\.


--
-- Data for Name: CustomerGroup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerGroup" (id, name, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Customer" (id, name, email, phone, "passwordHash", status, "emailVerifiedAt", "phoneVerifiedAt", locale, "taxNumber", "marketingConsent", "marketingConsentAt", "groupId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Cart" (id, "customerId", "sessionToken", status, currency, "couponCode", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TaxRate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TaxRate" (id, name, code, rate, treatment, "countryCode", region, "validFrom", "validTo", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, name, slug, description, "shortDescription", status, "publishedAt", "brandId", "taxRateId", "metaTitle", "metaDescription", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ProductVariant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductVariant" (id, "productId", sku, barcode, name, price, "compareAtPrice", "costPrice", weight, "trackInventory", "allowBackorder", "lowStockThreshold", "taxRateId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CartItem" (id, "cartId", "variantId", quantity, "unitPriceSnapshot", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, slug, description, "metaTitle", "metaDescription", "parentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CategoryTranslation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CategoryTranslation" (id, "categoryId", locale, name, slug, description, "metaTitle", "metaDescription") FROM stdin;
\.


--
-- Data for Name: Collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Collection" (id, name, slug, description, active, "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ShippingMethod; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShippingMethod" (id, name, code, active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "orderNumber", "idempotencyKey", "customerId", "customerName", "customerEmail", "customerPhone", "customerTaxNumber", locale, currency, status, "paymentStatus", "fulfillmentStatus", "pricesIncludeTax", subtotal, "discountTotal", "shippingTotal", "taxTotal", total, "shippingMethodId", "deliveryEmirate", notes, "internalNotes", "placedAt", "cancelledAt", "cancelReason", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Invoice" (id, "orderId", "invoiceNumber", status, "eInvoiceStatus", "issueDate", "dueDate", currency, "supplierLegalName", "supplierTradingName", "supplierTaxNumber", "customerName", "customerEmail", "customerTaxNumber", subtotal, "discountTotal", "taxTotal", total, "eInvoiceId", "eInvoiceProvider", "eInvoiceSubmittedAt", "eInvoiceError", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CreditNote; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CreditNote" (id, "invoiceId", "creditNoteNumber", status, "issueDate", currency, subtotal, "taxTotal", total, reason, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CreditNoteItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CreditNoteItem" (id, "creditNoteId", "productName", sku, quantity, "unitPrice", "taxCode", "taxTreatment", "taxRate", "taxAmount", total, "createdAt") FROM stdin;
\.


--
-- Data for Name: CustomerAddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerAddress" (id, "customerId", label, "recipientName", phone, "countryCode", emirate, city, area, street, building, unit, "addressLine1", "addressLine2", "postalCode", "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CustomerOAuthAccount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerOAuthAccount" (id, "customerId", provider, "providerAccountId", "createdAt") FROM stdin;
\.


--
-- Data for Name: CustomerSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerSession" (id, "customerId", "tokenHash", "ipAddress", "userAgent", "expiresAt", "lastUsedAt", "revokedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: CustomerToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CustomerToken" (id, "customerId", type, "tokenHash", attempts, "expiresAt", "usedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: DocumentSequence; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DocumentSequence" (key, period, "nextValue", prefix, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Warehouse; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Warehouse" (id, code, name, active, "countryCode", emirate, city, area, "addressLine1", "addressLine2", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InventoryItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InventoryItem" (id, "warehouseId", "variantId", quantity, reserved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InventoryMovement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InventoryMovement" (id, "inventoryItemId", "warehouseId", "variantId", type, quantity, "referenceType", "referenceId", note, "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "variantId", "productName", "variantName", sku, quantity, "unitPrice", "discountTotal", "taxTotal", total, "createdAt") FROM stdin;
\.


--
-- Data for Name: InventoryReservation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InventoryReservation" (id, "inventoryItemId", "orderItemId", quantity, status, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InvoiceAddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InvoiceAddress" (id, "invoiceId", "recipientName", "countryCode", emirate, city, area, street, building, unit, "addressLine1", "addressLine2", "postalCode", "createdAt") FROM stdin;
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InvoiceItem" (id, "invoiceId", "productName", "variantName", sku, quantity, "unitPrice", "discountTotal", "taxCode", "taxTreatment", "taxRate", "taxAmount", total, "createdAt") FROM stdin;
\.


--
-- Data for Name: LoginAttempt; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoginAttempt" (id, email, "ipAddress", success, "createdAt") FROM stdin;
cmushsasd00005dewgng5wkqr	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:26.942
cmushsc8600015dewr04f9a39	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:28.806
cmushsd6i00025dewmk670ve0	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:30.042
cmushse1b00035dewsmcc0xii	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:31.151
cmushsexz00045dew8dcf9vtd	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:32.327
cmushsfzv00055dew8w6f2gg3	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:33.691
cmushsgwn00065dew7jgf41lf	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:34.871
cmushshqh00075dew4fpinvcm	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:35.945
cmushsij900085dewml6qyuim	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:36.981
cmushsja500095dewvdjyys11	itsmeozadpak@gmail.com	::1	f	2026-10-03 14:33:37.949
cmuskbpfz000a5dewchaqb9y7	itsmeozadpak@gmail.com	::1	t	2026-10-03 15:44:31.631
cmuskby0h000c5dewqwop93qy	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:42.737
cmuskc1o7000d5dewjnlc1xqx	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:47.479
cmuskc4ik000e5dew8w23np4u	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:51.164
cmuskc5nc000f5dew9h7pzyqe	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:52.632
cmuskc6t0000g5dewoxl0gzjl	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:54.133
cmuskc7vh000h5dewyuqbayn4	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:55.517
cmuskc92k000i5dewkk8f4cgp	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:57.068
cmuskcact000j5dews6u4p27r	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:44:58.733
cmuskcbjc000k5dew7g0h8xrn	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:45:00.264
cmuskcd5w000l5dew0d39ueeg	itsmeozadpak@gmail.com	::1	f	2026-10-03 15:45:02.372
cmut8k5260000qaewwwxwv4z6	itsmeozadpak@gmail.com	::1	f	2026-10-04 03:02:55.902
cmut8kd7r0001qaewcx60ijuu	itsmeozadpak@gmail.com	::1	t	2026-10-04 03:03:06.471
cmutbxyfi00003eewiptw9ieq	ojhacode@gmail.com	::1	f	2026-10-04 04:37:39.342
cmutbyed200013eewj14yq2gj	itsmeozadpak@gmail.com	::1	t	2026-10-04 04:37:59.99
\.


--
-- Data for Name: NewsletterSubscriber; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."NewsletterSubscriber" (id, email, locale, source, "subscribedAt", "unsubscribedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, "customerId", "orderId", channel, template, recipient, status, "providerReference", error, "sentAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderAddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderAddress" (id, "orderId", type, "recipientName", phone, "countryCode", emirate, city, area, street, building, unit, "addressLine1", "addressLine2", "postalCode", "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderItemTaxLine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItemTaxLine" (id, "orderItemId", name, code, rate, treatment, amount, "createdAt") FROM stdin;
\.


--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Promotion" (id, name, description, type, value, "minimumOrderAmount", "usageLimit", "usageCount", "perCustomerLimit", stackable, priority, "startsAt", "endsAt", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PromotionCode; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromotionCode" (id, "promotionId", code, "usageLimit", "usageCount", active, "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderPromotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderPromotion" (id, "orderId", "promotionId", "promotionCodeId", "customerId", code, amount, "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderStatusHistory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderStatusHistory" (id, "orderId", "fromStatus", "toStatus", note, "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderTaxLine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderTaxLine" (id, "orderId", name, code, rate, treatment, amount, jurisdiction, "createdAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "orderId", method, status, currency, amount, provider, "providerReference", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PaymentTransaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PaymentTransaction" (id, "paymentId", type, status, amount, currency, "providerReference", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Permission" (id, name, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: PriceList; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PriceList" (id, name, currency, "customerGroupId", priority, active, "startsAt", "endsAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PriceListItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PriceListItem" (id, "priceListId", "variantId", "minQuantity", price, "compareAtPrice") FROM stdin;
\.


--
-- Data for Name: ProductAttribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductAttribute" (id, "productId", name, value) FROM stdin;
\.


--
-- Data for Name: ProductCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductCategory" ("productId", "categoryId") FROM stdin;
\.


--
-- Data for Name: ProductCollection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductCollection" ("collectionId", "productId", "sortOrder") FROM stdin;
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImage" (id, "productId", "variantId", url, "altText", "sortOrder", "createdAt") FROM stdin;
\.


--
-- Data for Name: ProductOption; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductOption" (id, "productId", name, "createdAt") FROM stdin;
\.


--
-- Data for Name: ProductOptionValue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductOptionValue" (id, "optionId", value, "createdAt") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, slug, "createdAt") FROM stdin;
\.


--
-- Data for Name: ProductTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductTag" ("productId", "tagId") FROM stdin;
\.


--
-- Data for Name: ProductTranslation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductTranslation" (id, "productId", locale, name, slug, description, "shortDescription", "metaTitle", "metaDescription", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProductVariantTranslation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductVariantTranslation" (id, "variantId", locale, name) FROM stdin;
\.


--
-- Data for Name: PromotionCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromotionCategory" ("promotionId", "categoryId") FROM stdin;
\.


--
-- Data for Name: PromotionProduct; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromotionProduct" ("promotionId", "productId") FROM stdin;
\.


--
-- Data for Name: Refund; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Refund" (id, "paymentId", "orderId", amount, currency, status, "providerReference", reason, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReturnRequest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ReturnRequest" (id, "orderId", "customerId", status, reason, note, "refundId", "creditNoteId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReturnItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ReturnItem" (id, "returnRequestId", "orderItemId", "variantId", quantity, reason, restock, "restockedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, "customerId", "productId", "variantId", "orderItemId", rating, title, body, "isVerifiedPurchase", "helpfulCount", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReviewImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ReviewImage" (id, "reviewId", url, "altText", "sortOrder", "createdAt") FROM stdin;
\.


--
-- Data for Name: ReviewVote; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ReviewVote" ("reviewId", "customerId", helpful, "createdAt") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RolePermission" ("roleId", "permissionId") FROM stdin;
\.


--
-- Data for Name: Shipment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Shipment" (id, "orderId", "warehouseId", "shippingMethodId", "trackingNumber", carrier, status, "shippedAt", "deliveredAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ShipmentEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShipmentEvent" (id, "shipmentId", status, description, location, "occurredAt", raw, "createdAt") FROM stdin;
\.


--
-- Data for Name: ShipmentItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShipmentItem" (id, "shipmentId", "orderItemId", quantity, "createdAt") FROM stdin;
\.


--
-- Data for Name: ShippingZone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShippingZone" (id, name, "countryCode", emirate, active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ShippingRate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShippingRate" (id, "shippingZoneId", "shippingMethodId", price, currency, "minOrderAmount", "maxOrderAmount", "minWeight", "maxWeight", active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Store" (id, "legalName", "tradingName", email, phone, "taxRegistrationNumber", "tradeLicenseNumber", "countryCode", currency, timezone, "defaultLocale", "supportedLocales", "addressLine1", "addressLine2", building, street, area, city, emirate, "postalCode", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserRole" ("userId", "roleId") FROM stdin;
\.


--
-- Data for Name: UserSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserSession" (id, "userId", "tokenHash", "ipAddress", "userAgent", "expiresAt", "lastUsedAt", "revokedAt", "createdAt") FROM stdin;
cmus636uz0001ew1abb6mbz1q	cmur06fu30000ew2dzcl8hjj8	2a0e0011268fdeffafa8cd168fdc503dde711a1ca83881bcfa1ccf395824cc71	\N	\N	2026-10-10 09:05:59.674	2026-10-03 09:49:20.463	2026-10-03 09:50:27.097	2026-10-03 09:05:59.675
cmus80jxy0003ew1aktt4nbax	cmur06fu30000ew2dzcl8hjj8	c548e713c0f1b28fc17dba3e56cb6fff9df99c0b8355ac5c9aecf82a46c21463	\N	\N	2026-10-10 09:59:55.893	2026-10-03 09:59:55.999	2026-10-03 10:00:01.073	2026-10-03 09:59:55.895
cmurqz4g10001ewf193wqovcl	cmur06fu30000ew2dzcl8hjj8	4452e407f9ebbd53be4445d802602204c25a2d524143533009532159e083c4d3	\N	\N	2026-10-10 02:02:55.679	2026-10-04 04:32:32.142	2026-10-04 04:37:20.61	2026-10-03 02:02:55.681
cmut8kd800002qaewl3odg17a	cmur06fu30000ew2dzcl8hjj8	da69a24909c8cefd39d028f7f79d29efeaa197a9bba5527ee68319638809989d	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-10-11 03:03:06.476	2026-10-04 04:37:52.74	2026-10-04 04:37:56.411	2026-10-04 03:03:06.48
cmus80qbq0005ew1au72sm2u3	cmur06fu30000ew2dzcl8hjj8	86597ba3aa96130cf4925b520d3007f8e181764966958f5c9729024a5f08d029	\N	\N	2026-10-10 10:00:04.165	2026-10-03 14:33:17.156	2026-10-03 14:33:22.036	2026-10-03 10:00:04.166
cmutbyedc00023eewxq08v32z	cmur06fu30000ew2dzcl8hjj8	119936f3f7eaa18e46593ffb19bb95bf234d7fcb672fe17086fcea60c3f79cb0	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-10-11 04:37:59.996	2026-10-04 17:07:20.389	\N	2026-10-04 04:38:00.001
cmuskbpga000b5dewp0zuhroq	cmur06fu30000ew2dzcl8hjj8	3aef3ad28ecb78f55cae38419fc683f1bd249c90ad3e48e9c7c35dcf32078abc	::1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	2026-10-10 15:44:31.638	2026-10-03 15:44:31.953	2026-10-03 15:44:36.397	2026-10-03 15:44:31.642
\.


--
-- Data for Name: VariantOptionValue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VariantOptionValue" ("variantId", "optionValueId") FROM stdin;
\.


--
-- Data for Name: WebhookEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WebhookEvent" (id, provider, "eventId", type, status, attempts, error, payload, "receivedAt", "processedAt") FROM stdin;
\.


--
-- Data for Name: Wishlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Wishlist" (id, "customerId", name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WishlistItem" (id, "wishlistId", "variantId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9a3f5898-c030-4eed-a817-3a9dab000a82	1028666478acddf6c7390f3a225a4a6992b74ae73160936c663ef83179d2a243	2026-10-02 19:14:09.574545+05:45	20261002132707_init	\N	\N	2026-10-02 19:14:01.987692+05:45	1
8faf859b-37a7-4df7-a47e-29a5e0f28bfa	3ea61ecc29ed5bb34c660b865a8b698803b168264e4ded6e497b675191f7f5dd	2026-10-03 19:46:50.42335+05:45	20261003140150_add_login_attempt	\N	\N	2026-10-03 19:46:50.257729+05:45	1
e589ff61-b20a-41cf-8494-5cb9f41f0f38	81f48be5bbaeb6f52811c2d846c2bd6fe132f82659bb6c58f79558f96422a858	2026-10-04 07:58:19.436167+05:45	20261003150000_add_user_password_reset	\N	\N	2026-10-04 07:58:19.404483+05:45	1
600f9091-d767-482c-82ae-7fe2cfeafb39	32e66b5d20384ff2417ce3aeebb8ecc3c3ed464488b1382080dd616ebf2e7a4e	2026-10-04 11:25:36.134434+05:45	20261004054036_add_user_profile_fields	\N	\N	2026-10-04 11:25:36.081247+05:45	1
\.


--
-- PostgreSQL database dump complete
--

\unrestrict gKkccRSazva0mkFTGV8VPCBMSIdgoPUeer6i4ZfAlDSLSeYR59senPJTmWE6v0I

