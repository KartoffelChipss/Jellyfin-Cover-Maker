import { UserRound } from 'lucide-preact';
import Modal from '../Modal';

interface ImpressumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImpressumModal = ({ isOpen, onClose }: ImpressumModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h1 class="text-2xl font-semibold flex items-center gap-2">
            <UserRound />
            Impressum
        </h1>
        <div class="border -my-2" />
        <section class="px-0">
            <h2 class="text-xl font-semibold mb-1">Angaben gemäß § 5 DDG</h2>
            <p className="mb-4">
                Jan Straßburger <br />
                Bert-Brecht-Straße 11 <br />
                66386 St. Ingbert
            </p>
            <p>
                Kontakt: <br />
                E-Mail: contact@strassburger.org
            </p>
        </section>
        <h2 className="text-xl font-semibold -mb-3">Haftungsausschluss (Disclaimer)</h2>
        <section class="px-0">
            <h3 className="text-lg font-semibold mb-1">1. Warnhinweis zu Inhalten</h3>
            <p>
                Die kostenlosen und frei zugänglichen Inhalte dieser Webseite wurden mit
                größtmöglicher Sorgfalt erstellt. Der Anbieter übernimmt jedoch keine Gewähr für die
                Richtigkeit und Aktualität der bereitgestellten Inhalte. Die Nutzung erfolgt auf
                eigene Gefahr. Allein durch den Aufruf der Inhalte kommt kein Vertragsverhältnis
                zwischen Nutzer und Anbieter zustande.
            </p>
        </section>
        <section class="px-0">
            <h3 className="text-lg font-semibold mb-1">2. Verlinkungen</h3>
            <p>
                Diese Webseite enthält Verlinkungen zu externen Webseiten Dritter. Für deren Inhalte
                ist stets der jeweilige Anbieter verantwortlich. Bei Verknüpfung waren keine
                Rechtsverstöße ersichtlich. Eine permanente inhaltliche Kontrolle der verlinkten
                Seiten ist ohne konkrete Anhaltspunkte nicht zumutbar. Bei Bekanntwerden von
                Rechtsverstößen werden derartige Links umgehend entfernt.
            </p>
        </section>
        <section class="px-0">
            <h3 className="text-lg font-semibold mb-1">3. Urheberrecht / Leistungsschutzrecht</h3>
            <p>
                Die auf dieser Webseite veröffentlichten Inhalte unterliegen dem deutschen Urheber-
                und Leistungsschutzrecht. Jede nicht gesetzlich zugelassene Verwertung bedarf der
                vorherigen schriftlichen Zustimmung des Anbieters oder Rechteinhabers. Dies gilt
                insbesondere für Vervielfältigung, Bearbeitung, Übersetzung, Einspeicherung und
                Wiedergabe in Datenbanken oder anderen elektronischen Medien und Systemen. Kopien
                und Downloads sind nur für den persönlichen, privaten und nicht kommerziellen
                Gebrauch erlaubt. Die Darstellung dieser Webseite in fremden Frames oder iFrames ist
                nur mit schriftlicher Erlaubnis zulässig.
            </p>
        </section>
        <section class="px-0">
            <h3 className="text-lg font-semibold mb-1">4. Keine Werbung</h3>
            <p>
                Die Verwendung der Kontaktdaten des Impressums zur gewerblichen Werbung ist
                ausdrücklich nicht erwünscht, es sei denn, der Anbieter hat zuvor seine schriftliche
                Einwilligung erteilt oder es besteht bereits eine Geschäftsbeziehung.
            </p>
        </section>
        <section class="px-0">
            <h3 className="text-lg font-semibold mb-1">5. Besondere Nutzungsbedingungen</h3>
            <p>
                Soweit besondere Bedingungen für einzelne Nutzungen dieser Website von den
                vorstehenden Punkten abweichen, wird an entsprechender Stelle ausdrücklich darauf
                hingewiesen. In diesem Fall gelten im jeweiligen Einzelfall die besonderen
                Bedingungen.
            </p>
        </section>
    </Modal>
);

export default ImpressumModal;
