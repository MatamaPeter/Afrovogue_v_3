import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A friendly name for this address (e.g. Home, Work, Office)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Phone number for delivery contact (e.g. +254712345678)",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+254[0-9]{9}$/, {
            name: "kenyanPhone",
            invert: false,
          })
          .custom((phone: string | undefined) => {
            if (!phone) {
              return "Phone number is required";
            }
            if (!phone.match(/^\+254[0-9]{9}$/)) {
              return "Please enter a valid Kenyan phone number (e.g. +254712345678)";
            }
            return true;
          }),
    }),
    defineField({
      name: "address",
      title: "Street Address/Building",
      type: "string",
      description: "Building name, street address, or landmark",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "area",
      title: "Area/Estate",
      type: "string",
      description: "Area, estate, or neighborhood",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City/Town",
      type: "string",
      options: {
        list: [
          { title: "Nairobi", value: "nairobi" },
          { title: "Mombasa", value: "mombasa" },
          { title: "Kisumu", value: "kisumu" },
          { title: "Nakuru", value: "nakuru" },
          { title: "Eldoret", value: "eldoret" },
          { title: "Thika", value: "thika" },
          { title: "Malindi", value: "malindi" },
          { title: "Kitale", value: "kitale" },
          { title: "Garissa", value: "garissa" },
          { title: "Kakamega", value: "kakamega" },
          { title: "Machakos", value: "machakos" },
          { title: "Meru", value: "meru" },
          { title: "Nyeri", value: "nyeri" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customCity",
      title: "Custom City (if Other)",
      type: "string",
      description: "Specify city if not listed above",
      hidden: ({ document }) => document?.city !== "other",
      validation: (Rule) =>
        Rule.custom((customCity, context) => {
          const city = (context.document as Record<string, unknown>)?.city as string;
          if (city === "other" && !customCity) {
            return "Please specify the city name";
          }
          return true;
        }),
    }),
    defineField({
      name: "county",
      title: "County",
      type: "string",
      options: {
        list: [
          { title: "Nairobi", value: "nairobi" },
          { title: "Mombasa", value: "mombasa" },
          { title: "Kwale", value: "kwale" },
          { title: "Kilifi", value: "kilifi" },
          { title: "Tana River", value: "tana-river" },
          { title: "Lamu", value: "lamu" },
          { title: "Taita Taveta", value: "taita-taveta" },
          { title: "Garissa", value: "garissa" },
          { title: "Wajir", value: "wajir" },
          { title: "Mandera", value: "mandera" },
          { title: "Marsabit", value: "marsabit" },
          { title: "Isiolo", value: "isiolo" },
          { title: "Meru", value: "meru" },
          { title: "Tharaka Nithi", value: "tharaka-nithi" },
          { title: "Embu", value: "embu" },
          { title: "Kitui", value: "kitui" },
          { title: "Machakos", value: "machakos" },
          { title: "Makueni", value: "makueni" },
          { title: "Nyandarua", value: "nyandarua" },
          { title: "Nyeri", value: "nyeri" },
          { title: "Kirinyaga", value: "kirinyaga" },
          { title: "Murang'a", value: "muranga" },
          { title: "Kiambu", value: "kiambu" },
          { title: "Turkana", value: "turkana" },
          { title: "West Pokot", value: "west-pokot" },
          { title: "Samburu", value: "samburu" },
          { title: "Trans Nzoia", value: "trans-nzoia" },
          { title: "Uasin Gishu", value: "uasin-gishu" },
          { title: "Elgeyo Marakwet", value: "elgeyo-marakwet" },
          { title: "Nandi", value: "nandi" },
          { title: "Baringo", value: "baringo" },
          { title: "Laikipia", value: "laikipia" },
          { title: "Nakuru", value: "nakuru" },
          { title: "Narok", value: "narok" },
          { title: "Kajiado", value: "kajiado" },
          { title: "Kericho", value: "kericho" },
          { title: "Bomet", value: "bomet" },
          { title: "Kakamega", value: "kakamega" },
          { title: "Vihiga", value: "vihiga" },
          { title: "Bungoma", value: "bungoma" },
          { title: "Busia", value: "busia" },
          { title: "Siaya", value: "siaya" },
          { title: "Kisumu", value: "kisumu" },
          { title: "Homa Bay", value: "homa-bay" },
          { title: "Migori", value: "migori" },
          { title: "Kisii", value: "kisii" },
          { title: "Nyamira", value: "nyamira" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postalCode",
      title: "Postal Code (Optional)",
      type: "string",
      description: "Kenyan postal code (e.g. 00100, 80100)",
      validation: (Rule) =>
        Rule.regex(/^[0-9]{5}$/, {
          name: "kenyanPostalCode",
          invert: false,
        }).custom((code: string | undefined) => {
          if (code && !code.match(/^[0-9]{5}$/)) {
            return "Please enter a valid 5-digit postal code";
          }
          return true;
        }),
    }),
    defineField({
      name: "deliveryInstructions",
      title: "Delivery Instructions",
      type: "text",
      description: "Additional instructions for the delivery person",
      rows: 3,
    }),
    defineField({
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      address: "address",
      area: "area",
      city: "city",
      customCity: "customCity",
      county: "county",
      isDefault: "isDefault",
    },
    prepare({ title, address, area, city, customCity, county, isDefault }) {
      const displayCity = city === "other" ? customCity : city;
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${address}, ${area}, ${displayCity}, ${county}`,
      };
    },
  },
});
