import Image from 'next/image';
import { createClient } from 'next-sanity'
import { useNextSanityImage } from 'next-sanity-image';

const sanityClient = createClient({
	dataset: "public",
	projectId: "cctd4ker",
	apiVersion: '2022-12-02', // Learn more: https://www.sanity.io/docs/api-versioning
	useCdn: true
})


const SanityImage = ({
	image,
	className = "",
	sizes = "100vw",
	priority = false,
	quality = 75,
	placeholder = "empty",
	fill = false,
	style
}) => {

	const imageProps = useNextSanityImage(sanityClient, image);

	const maxWidth = image.maxWidth ?
		{ maxWidth: `${image.maxWidth}px` } :
		{}

	const colorStyles = image.palette ?
		{ "--img-bg-color": image.palette.background, "--img-color": image.palette.foreground } :
		{}

	const defaultCSS = { maxWidth: '100%', height: 'auto', ...maxWidth, ...colorStyles, ...style }
	const defaultFillCSS = { objectFit: "cover", ...maxWidth, ...colorStyles, ...style }

	const handleImageLoaded = (img) => {
		img.removeAttribute("data-loading");
	}

	return (
		<Image
			className={className}
			alt={image?.alt || " "}
			style={fill ? defaultFillCSS : defaultCSS}
			{...imageProps}
			fill={fill}
			quality={quality}
			data-loading={true}
			placeholder={placeholder}
			priority={priority}
			sizes={sizes}
			onLoadingComplete={handleImageLoaded}
			width={fill ? 0 : imageProps.width}
			height={fill ? 0 : imageProps.height}
		/>
	)
};



const Example = ({ image }) => {
	return <SanityImage
		image={image}
		priority={true}
	/>
}

export const getStaticProps = async () => {
	const data = await sanityClient.fetch(`*[_id == "homepage"][0]{
		videoBanner {
			landscapeFallBack {
				asset->
			}
		}
	}`);

	const image = data.videoBanner.landscapeFallBack

	return { props: { image } }
}

export default Example;
