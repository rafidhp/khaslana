<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

use App\Models\Category;
use App\Models\Product\Product;
use App\Models\Product\Attribute;
use App\Models\Product\AttributeValue;
use App\Models\Product\ProductVariant;
use App\Models\Product\ProductImage;
use App\Models\Product\VariantAttribute;

class ProductController extends Controller
{
    public function index() {
        $products = collect();
        $categories = collect();
        $user = Auth::user();

        if($user->is_umkm) {
            $umkm = $user->umkm;
    
            $products = Product::where('umkm_id', $umkm->id)->with([
                'category',
                'promo',
                'productImages',
                'productVariants',
                'productVariants.attributeValues',
                'productVariants.attributeValues.attribute',
                'umkm',
                'umkm.city',
            ])
            ->latest()
            ->paginate(20);
            $categories = Category::all();
        }

        return Inertia::render('umkm/product', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create() {
        $categories = Category::all();
        return Inertia::render('umkm/product/product-create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'images' => ['required', 'array'],
            'images.*' => ['image', 'max:1024'],
            'attributes' => ['required', 'array'],
            'attributes.*.name' => ['required', 'string'],
            'attributes.*.values' => ['required', 'array'],
            'attributes.*.values.*' => ['required', 'string'],
            'variants' => ['required', 'array'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.attributes' => ['required', 'array'],
        ]);

        DB::beginTransaction();
        $imagePaths = [];

        try {
            $umkm = Auth::user()->umkm;
            $product = Product::create([
                'umkm_id' =>Auth::user()->umkm->id,
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            // product images create
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = pathinfo(
                        $image->getClientOriginalName(),
                        PATHINFO_FILENAME
                    );
                    
                    $extension = $image->getClientOriginalExtension();
                    $fileName =
                        substr(Str::slug($originalName), 0, 70)
                        . '-'
                        . time()
                        . '-'
                        . uniqid()
                        . '.'
                        . $extension;

                    $path = $image->storeAs(
                        "products/{$umkm->id}", $fileName, 'public'
                    );

                    $imagePaths[] = $path;
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                    ]);
                }
            }

            // attribute and attribute value create
            $attributeMap = [];

            foreach ($validated['attributes'] as $attributeData) {
                $attribute = Attribute::create([
                    'name' => trim($attributeData['name']),
                ]);

                foreach ($attributeData['values'] as $value) {
                    $attributeValue = AttributeValue::create([
                        'attribute_id' => $attribute->id,
                        'value' => trim($value),
                    ]);
                    $attributeMap[trim($attribute->name)][trim($value)] = $attributeValue->id;
                }
            }

            // variants create
            foreach ($validated['variants'] as $variantData) {
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'price' => $variantData['price'],
                    'stock' => $variantData['stock'],
                ]);

                foreach ($variantData['attributes'] as $attribute) {
                    VariantAttribute::create([
                        'variant_id' => $variant->id,
                        'attribute_value_id' => $attributeMap[
                            trim($attribute['attribute'])
                        ][
                            trim($attribute['value'])
                        ],
                    ]);
                }
            }
            DB::commit();

            return redirect()->route('product')->with('success', 'Produk berhasil ditambahkan.');
        } catch (\Throwable $th) {
            DB::rollBack();

            foreach ($imagePaths as $path) {
                if (
                    Storage::disk('public')->exists($path)
                ) {
                    Storage::disk('public')->delete($path);
                }
            }
            return redirect()->back()->withErrors(['message' => $th->getMessage()]);
        }
    }

    public function edit(Product $product) {
        $product->load([
            'productImages',
            'productVariants.attributeValues.attribute',
        ]);

        return Inertia::render('umkm/product/product-create', [
            'product' => $product,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product) {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],

            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:1024'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['integer', 'exists:product_images,id'],

            'attributes' => ['required', 'array'],
            'attributes.*.name' => ['required', 'string'],
            'attributes.*.values' => ['required', 'array'],
            'attributes.*.values.*' => ['required', 'string'],

            'variants' => ['required', 'array'],
            'variants.*.price' => ['required', 'numeric'],
            'variants.*.stock' => ['required', 'integer'],
            'variants.*.attributes' => ['required', 'array'],
        ]);
        DB::beginTransaction();
        $newImagePaths = [];

        try {
            $umkm = Auth::user()->umkm;

            $product->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            $keepImageIds = $validated['existing_images'] ?? [];
            $imagesToDelete = ProductImage::where('product_id', $product->id)
                ->whereNotIn('id', $keepImageIds)
                ->get();

            foreach ($imagesToDelete as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
                $image->delete();
            }

            $variantIds = ProductVariant::where('product_id', $product->id)->pluck('id');
            VariantAttribute::whereIn('variant_id', $variantIds)->delete();
            ProductVariant::where('product_id', $product->id)->delete();

            $attributeIds = AttributeValue::whereIn('id',
                VariantAttribute::query()->pluck('attribute_value_id')
            )
            ->pluck('attribute_id');

            AttributeValue::whereIn('attribute_id', $attributeIds)->delete();
            Attribute::whereIn('id', $attributeIds)->delete();

            if ($request->hasFile('images')) {
                foreach (
                    $request->file('images')
                    as $image
                ) {
                    $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $image->getClientOriginalExtension();

                    $fileName =
                        substr(Str::slug($originalName),0, 70)
                        . '-'
                        . time()
                        . '-'
                        . uniqid()
                        . '.'
                        . $extension;

                    $path = $image->storeAs("products/{$umkm->id}", $fileName, 'public');

                    $newImagePaths[] = $path;
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                    ]);
                }
            }
            $attributeMap = [];

            foreach (
                $validated['attributes']
                as $attributeData
            ) {
                $attribute = Attribute::create([
                    'name' => trim($attributeData['name']),
                ]);

                foreach (
                    $attributeData['values']
                    as $value
                ) {
                    $attributeValue =
                        AttributeValue::create([
                            'attribute_id' => $attribute->id,
                            'value' => trim($value),
                        ]);

                    $attributeMap[
                        trim($attribute->name)
                    ][trim($value)] = $attributeValue->id;
                }
            }

            foreach (
                $validated['variants']
                as $variantData
            ) {
                $variant =
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);

                foreach (
                    $variantData['attributes']
                    as $attribute
                ) {
                    VariantAttribute::create([
                        'variant_id' => $variant->id,
                        'attribute_value_id' =>
                            $attributeMap[
                                trim($attribute['attribute'])
                            ][trim($attribute['value'])],
                    ]);
                }
            }
            DB::commit();
            return redirect()->route('product')->with('success', 'Produk berhasil diperbarui.');
        } catch (\Throwable $th) {
            DB::rollBack();

            foreach (
                $newImagePaths as $path
            ) {
                if (
                    Storage::disk('public')->exists($path)
                ) {
                    Storage::disk('public')->delete($path);
                }
            }
            return back()->withErrors([
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function destroy($product_id) {
        $user = Auth::user();

        if (!$user->is_umkm) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses.');
        }

        $product = Product::where('id', $product_id)
                    ->where('umkm_id', $user->umkm->id)
                    ->first();

        if (!$product) {
            return redirect()->back()->with('error', 'Produk tidak ditemukan.');
        }

        $product->delete();
        return redirect()->route('product')->with('success', 'Produk berhasil dihapus.');
    }
}
