import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GENDERS,
  HINGES,
  MATERIALS,
  SHAPES,
} from '@/constants/product-constants';
import { decryptUrl } from '@/lib/encryption';
import { isFromCloudinary } from '@/lib/is-from-cloudinary';
import { cn } from '@/lib/utils';
import { ProductSchema } from '@/types/product';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<any>;
  isLoading: boolean;
  defaultImgSrc?: string;
};

export function ProductFormFields({
  form,
  isLoading,
  defaultImgSrc = '',
}: Props) {
  const src = defaultImgSrc ? decryptUrl(defaultImgSrc) : '';
  const [imgSrc, setImgSrc] = useState<any>(src);

  // For manually resetting input field
  const [imgInputKey, setImgInputKey] = useState(0);

  return (
    <div className="grid sm:grid-cols-2 gap-1.5 sm:gap-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter eye-glass name"
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter brand name"
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                placeholder="Price in dollars"
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                placeholder="Available quantity"
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="frame.material"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frame Material</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder="Select frame material" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {MATERIALS.map((material) => (
                  <SelectItem
                    key={material}
                    value={material}
                    className="capitalize"
                  >
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="frame.shape"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frame Shape</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder="Select frame shape" />
                </SelectTrigger>

                <SelectContent>
                  {SHAPES.map((shape) => (
                    <SelectItem
                      key={shape}
                      value={shape}
                      className="capitalize"
                    >
                      {shape}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hinge_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hinge Type</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder="Select hinge type" />
                </SelectTrigger>

                <SelectContent>
                  {HINGES.map((hinge) => (
                    <SelectItem
                      key={hinge}
                      value={hinge}
                      className="capitalize"
                    >
                      {hinge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lens_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lens Type</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Lens Type"
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem
                    key={gender}
                    value={gender}
                    className="capitalize"
                  >
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter eye-glass color"
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="temple_length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Temple Length</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter length in mm"
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bridge_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bridge Size</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter bridge size in mm"
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Product Image</FormLabel>
            <FormControl>
              <Input
                accept=".jpg, .jpeg, .png, .svg, .webp"
                type="file"
                key={imgInputKey}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e.target.files ? e.target.files[0] : null);

                  if (e.target.files) {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = (e) => setImgSrc(e.target?.result);
                  }
                }}
              />
            </FormControl>
            <FormMessage />

            {(imgSrc.startsWith('data:image') || isFromCloudinary(imgSrc)) && (
              <div
                className={cn(
                  'border rounded-md overflow-hidden max-w-full relative',
                  {
                    'opacity-50': isLoading,
                  }
                )}
              >
                <Image
                  className="object-cover object-center aspect-[6/4]"
                  src={imgSrc}
                  width={500}
                  height={333}
                  alt="Preview image"
                />

                {imgSrc.startsWith('data:image') && (
                  <button
                    className="absolute top-2 right-2 bg-white border p-1 rounded shadow-sm group"
                    onClick={() => {
                      form.resetField('image');
                      setImgInputKey((prev) => prev + 1);
                      setImgSrc(src);
                    }}
                  >
                    <span className="sr-only">Unselect image</span>
                    <X className="size-3 stroke-gray-500 group-hover:stroke-gray-800" />
                  </button>
                )}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
