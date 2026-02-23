<script lang="ts">
	import { version } from '$app/environment';
	import { resolve } from '$app/paths';
</script>

<main>
	<a href={resolve('/')} aria-label="Zur Startseite">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
			><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg
		>
	</a>

	<h1>Chalkboard</h1>

	<p>
		Ziel von „Chalkboard“ ist es ein Verzeichnis für Boulderübungen abzubilden und diese
		systematisch zu klassifizieren.
	</p>
	<p>
		Es dient explizit <i>nicht</i> als Trainingsapp und macht daher auch keinerlei Angaben
		hinsichtlich Wiederholungen, Trainingsfrequenz, Gewichtsangaben, usw.
		<i>Du führst alle Übungen auf eigene Gefahr aus.</i>
	</p>
	<p>
		Stattdessen soll es dir dabei helfen einen Überblick über mögliche Übungen zu bekommen und
		einfache referenzierbare Namen für diese zu haben. Dies bietet dir und/oder deinem Coach die
		Grundlage einen Trainingsplan zu erstellen und zu kommunizieren. Mit den Kurznamen lässt sich in
		Kürze erkennen auf welchen Aspekten dein Fokus liegt, und wo du im Vergleich weniger
		investierst.
	</p>

	<h2>Klassifizierung</h2>

	<p>Jeder Kurzname besteht aus drei Segmenten:</p>

	<ol>
		<li>In Großbuchstaben, der Bereich auf den abgezielt wird</li>
		<li>In Kleinbuchstaben, das Ziel bzw. den Aspekt der Übung</li>
		<li>Startend mit einem Großbuchstaben, eine Abkürzung für den Namen der Übung</li>
	</ol>

	<p>So steht „ORmPU“ beispielsweise für:</p>

	<ol>
		<li>Oberer Rücken (OR)</li>
		<li>Maximalkraft (m)</li>
		<li>Pull-up (PU)</li>
	</ol>

	<p>
		Pull-ups könnten auch als Ausdauerübung (a) durchgeführt werden. Hierfür würdest du dir „ORaPU“
		notieren. Chalkboard führt nicht alle denkbaren Varianten. Die Kurzschreibweise, mit ihrer
		alternierender Groß- und Kleinschreibung der Segmente, ermöglicht schnelle und invididuelle
		handschriftliche Notizen.
	</p>
	<p>
		Falls eine Übung in keinen klaren Bereich fällt, kannst du das Segment einfach weglassen. Durch
		die Groß- und Kleinschreibung ist der Kurzname immernoch eindeutig, sodass „tV6“ beispielsweise
		für eine allgemeine Techniksession „t“ auf V6-Niveau stehen würde. Alternativ kannst du auch
		Trennzeichen notieren („-t-V6“) und/oder durch beliebige Zeichen ersetzen („_tV6“, „*t*“, usw.)
	</p>

	<hr />

	<small>v{version}</small>
</main>

<style lang="scss">
	main {
		padding: 3rem 1rem;
	}

	p {
		text-align: justify;
	}

	hr {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 2rem 0;
	}

	small {
		opacity: 0.8;
	}

	@media (min-width: 600px) {
		main {
			width: 90ch;
			max-width: 90vw;
			margin: 0 auto;
		}
	}
</style>
