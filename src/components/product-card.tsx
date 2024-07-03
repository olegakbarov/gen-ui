import { zodToJsonSchema } from "zod-to-json-schema";
import * as z from "zod";

//
// SCHEMA AND TYPE
export const ProductCardSchema = z.object({
  title: z.string().describe("Title of the product card"),
  subtitle: z.string().describe("Subtitle of the product card"),
  image: z.string().describe("Image of the product card"),
});
type ProductCardProps = z.infer<typeof ProductCardSchema>;
export const ProductCardJsonSchema = zodToJsonSchema(ProductCardSchema, {
  name: "ProductCard",
});

//
// COMPONENT
export const TimelineItem = ({ title, subtitle, image }: ProductCardProps) => {
  return (
    <a
      href="#"
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src="/docs/images/blog/image-4.jpg"
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </a>
  );
};
