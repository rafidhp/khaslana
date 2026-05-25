import antingImg from "@/assets/images/catalog/anting-perak.png";
import kopiImg from "@/assets/images/catalog/kopi-gayo.png";
import sendalImg from "@/assets/images/catalog/sendal-garut.png";
import vaseImg from "@/assets/images/catalog/vase-keramik.png";

const baseProducts = [
    { id: 1, name: "Vase Keramik Kasongan", price: "Rp 185.000", image: vaseImg, discount: "67%", rating: "4.9", location: "Kab. Bandung", sold: "205", slug: "vase-keramik-kasongan" },
    { id: 2, name: "Sandalias Kulit Garut", price: "Rp 320.000", image: sendalImg, rating: "4.5", location: "Kab. Bandung", sold: "102", slug: "sendal-kulit-garut" },
    { id: 3, name: "Kopi Arabica Gayo", price: "Rp 145.000", image: kopiImg, discount: "19%", rating: "4.5", location: "Kab. Bandung", sold: "103", slug: "kopi-arabica-gayo" },
    { id: 4, name: "Anting Perak Kotagede", price: "Rp 450.000", image: antingImg, rating: "4.5", location: "Kab. Bandung", sold: "108", slug: "anting-perak-kotagede" }
];

export const displayProducts = Array.from({ length: 24 }, (_, i) => ({
    ...baseProducts[i % baseProducts.length],
    id: i + 1
}));